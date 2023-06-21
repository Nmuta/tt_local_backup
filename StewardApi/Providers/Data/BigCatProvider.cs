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
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using static System.Net.WebRequestMethods;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
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

                            this.refreshableCacheStore.PutItem(BigCatAuthToken, TimeSpan.FromSeconds(result.ExpiresIn), result);

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
