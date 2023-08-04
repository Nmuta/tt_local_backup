﻿using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.BigCat;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Providers.BigCat
{
    /// <inheritdoc />
    public sealed class BigCatService : IBigCatService, IInitializeable
    {
        private const string BigCatAuthToken = "BigCatAuthToken";

        private readonly string tenantId;
        private readonly string clientId;
        private string clientSecret;

        private readonly KeyVaultConfig keyVaultConfig;
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BigCatService"/> class.
        /// </summary>
        public BigCatService(KeyVaultConfig keyVaultConfig, IRefreshableCacheStore refreshableCacheStore, IConfiguration configuration)
        {
            keyVaultConfig.ShouldNotBeNull(nameof(keyVaultConfig));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));

            this.tenantId = configuration[ConfigurationKeyConstants.AzureTenantId];
            this.clientId = configuration[ConfigurationKeyConstants.AzureClientId];
            this.keyVaultConfig = keyVaultConfig;
            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <summary>
        ///     Gets auth token from refreshable cache store. If expired generates a new one and uploads to cache.
        /// </summary>
        private string AuthToken
        {
            get
            {
                return this.refreshableCacheStore.GetItem<string>(BigCatAuthToken)
                    ?? this.MintAuthTokenAsync().GetAwaiter().GetResult();
            }
        }

        /// <inheritdoc />
        public async Task InitializeAsync()
        {
            this.clientSecret = this.keyVaultConfig.AzureAuthClientSecret;

            await this.MintAuthTokenAsync().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<List<BigCatProductPrice>> RetrievePriceCatalogAsync(string productId)
        {
            return this.refreshableCacheStore.GetItem<List<BigCatProductPrice>>(BigCatProductPrice.BuildCacheKey(productId))
                ?? await this.GetPricesAsync(productId).ConfigureAwait(false);
        }

        private async Task<List<BigCatProductPrice>> GetPricesAsync(string productId)
        {
            var uri = $"https://frontdoor-displaycatalog.bigcatalog.microsoft.com/v8.0/products/{productId}?market=neutral&languages=neutral&catalogIds=1";

            using (var handler = new HttpClientHandler() { CookieContainer = new CookieContainer() })
            {
                using (var client = new HttpClient(handler) { BaseAddress = new Uri(uri) })
                {
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add(HttpRequestHeader.Authorization.ToString(), $"bearer {this.AuthToken}");
                    client.DefaultRequestHeaders.Add(HttpRequestHeader.Host.ToString(), "frontdoor-displaycatalog.bigcatalog.microsoft.com");
                    client.DefaultRequestHeaders.Add("MS-CV", Guid.NewGuid().ToString());

                    client.Timeout = TimeSpan.FromMilliseconds(10000);

                    var res = await client.GetAsync(string.Empty).ConfigureAwait(false);

                    if (res.IsSuccessStatusCode)
                    {
                        var content = await res.Content.ReadAsStringAsync().ConfigureAwait(false);
                        var result = JsonConvert.DeserializeObject<JObject>(content);

                        var prices = new List<BigCatProductPrice>();

                        // Let's target the stuff we actually want.
                        var availabilities = result["Product"]["DisplaySkuAvailabilities"][0]["Availabilities"];

                        foreach (var availability in availabilities.Children())
                        {
                            var priceToken = availability["OrderManagementData"]["Price"];

                            var price = new BigCatProductPrice
                            {
                                CurrencyCode = (string)priceToken["CurrencyCode"],
                                WholesaleCurrencyCode = (string)priceToken["WholesaleCurrencyCode"],
                                IsPiRequired = (bool)priceToken["IsPIRequired"],
                                MSRP = (double)priceToken["MSRP"],
                                ListPrice = (double)priceToken["ListPrice"],
                                WholesalePrice = priceToken["WholesalePrice"] != null ? (double)priceToken["WholesalePrice"] : 0,
                            };

                            prices.Add(price);
                        }

                        // Sanitize, mostly removing empty data from the list.
                        var equalityComparer = new BigCatProductPriceEqualityComparer();
                        prices = prices.Where(price => price.MSRP != 0).Distinct(equalityComparer).ToList();

                        this.refreshableCacheStore.PutItem(BigCatProductPrice.BuildCacheKey(productId), TimeSpan.FromHours(24), prices);

                        return prices;
                    }
                    else
                    {
                        throw new UnknownFailureStewardException("Failed to retrieve Big Catalog pricing information");
                    }
                }
            }
        }

        private async Task<string> MintAuthTokenAsync()
        {
            var uri = $"https://login.microsoftonline.com/{this.tenantId}/oauth2/token";

            using (var handler = new HttpClientHandler() { CookieContainer = new CookieContainer() })
            {
                using (var client = new HttpClient(handler) { BaseAddress = new Uri(uri) })
                {
                    var body = new List<KeyValuePair<string, string>>
                    {
                        new KeyValuePair<string, string>("grant_type", "client_credentials"),
                        new KeyValuePair<string, string>("client_id", this.clientId),
                        new KeyValuePair<string, string>("client_secret", this.clientSecret),
                        new KeyValuePair<string, string>("resource", "https://bigcatalog.commerce.microsoft.com"),
                    };

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "multipart/form-data");
                    client.Timeout = TimeSpan.FromMilliseconds(10000);

                    using (var encodedBody = new FormUrlEncodedContent(body))
                    {
                        var res = await client.PostAsync(string.Empty, encodedBody).ConfigureAwait(false);

                        if (res.IsSuccessStatusCode)
                        {
                            var content = await res.Content.ReadAsStringAsync().ConfigureAwait(false);
                            var result = JsonConvert.DeserializeObject<OAuthResponse>(content);

                            this.refreshableCacheStore.PutItem(BigCatAuthToken, TimeSpan.FromSeconds(result.ExpiresIn), result.AccessToken);

                            return result.AccessToken;
                        }
                        else
                        {
                            throw new UnknownFailureStewardException("Failed to authenticate to Big Catalog API");
                        }
                    }
                }
            }
        }
    }
}
