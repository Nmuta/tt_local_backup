using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Kusto.Data.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using static System.Net.WebRequestMethods;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    public class BigCatProductPrice
    {
        public string CurrencyCode;
        public bool IsPiRequired;
        public double ListPrice;
        public double MSRP;
        public string WholesaleCurrencyCode;
        public double? WholesalePrice;
    }

    public class AuthResponse
    {
        [JsonProperty("token_type")]
        public string TokenType { get; set; }

        [JsonProperty("access_token")]
        public string AccessToken { get; set; }

        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }
    }

    /// <inheritdoc />
    public sealed class BigCatProvider : IBigCatProvider, IInitializeable
    {
        const string BigCatAuthToken = "BigCatAuthToken";

        private readonly string tenantId;
        private readonly string clientId;
        private string clientSecret;

        private readonly IKeyVaultProvider keyVaultProvider;
        private readonly IConfiguration configuration;
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BigCatProvider"/> class.
        /// </summary>
        public BigCatProvider(IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IConfiguration configuration)
        {
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            configuration.ShouldNotBeNull(nameof(configuration));

            this.tenantId = configuration[ConfigurationKeyConstants.AzureTenantId];
            this.clientId = configuration[ConfigurationKeyConstants.AzureClientId];
            this.keyVaultProvider = keyVaultProvider;
            this.configuration = configuration;
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
            this.clientSecret = await this.keyVaultProvider.GetSecretAsync(
                this.configuration[ConfigurationKeyConstants.KeyVaultUrl],
                this.configuration[ConfigurationKeyConstants.AzureClientSecretKey]).ConfigureAwait(false);

            await this.MintAuthTokenAsync().ConfigureAwait(false);
        }

        public async Task<List<BigCatProductPrice>> RetrievePriceCatalogAsync(string productId)
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

                    var res = await client.PostAsync(string.Empty, null).ConfigureAwait(false);

                    if (res.IsSuccessStatusCode)
                    {
                        var content = await res.Content.ReadAsStringAsync().ConfigureAwait(false);
                        var result = JsonConvert.DeserializeObject<JObject>(content);



                        var prices = new List<BigCatProductPrice>();

                        // Let's rip out the stuff we actually want.
                        var availabilities = result["Product"]["DisplaySkuAvailabilities"][0]["Availabilities"];

                        foreach (var availability in availabilities.Children())
                        {
                            var priceToken = availability["OrderManagementData"]["Price"];

                            var CurrencyCode = (string)priceToken["CurrencyCode"];
                            var WholesaleCurrencyCode = (string)priceToken["WholesaleCurrencyCode"];
                            var IsPiRequired = (bool)priceToken["IsPIRequired"];
                            var MSRP = (double)priceToken["MSRP"];
                            var ListPrice = (double)priceToken["ListPrice"];

                            var wholesalePriceExists = priceToken["WholesalePrice"] != null;
                            var WholesalePrice = wholesalePriceExists ? (double)priceToken["WholesalePrice"] : 0;

                            var price = new BigCatProductPrice
                            {
                                CurrencyCode = CurrencyCode,
                                WholesaleCurrencyCode = WholesaleCurrencyCode,
                                IsPiRequired = IsPiRequired,
                                MSRP = MSRP,
                                ListPrice = ListPrice,
                                WholesalePrice = WholesalePrice,
                            };

                            //var price = new BigCatProductPrice
                            //{
                            //    CurrencyCode = (string)priceToken["CurrencyCode"],
                            //    WholesaleCurrencyCode = (string)priceToken["WholesaleCurrencyCode"],
                            //    IsPiRequired = (bool)priceToken["IsPiRequired"],
                            //    MSRP = (double)priceToken["MSRP"],
                            //    ListPrice = (double)priceToken["ListPrice"],
                            //    WholesalePrice = (double)priceToken["WholesalePrice"]
                            //};

                            prices.Add(price);
                        }

                        //this.refreshableCacheStore.PutItem(BigCatAuthToken, TimeSpan.FromSeconds(result.ExpiresIn), result);

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
                            var result = JsonConvert.DeserializeObject<AuthResponse>(content);

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
