using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.KeyVault.Models;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <inheritdoc />
    public sealed class KeyVaultProvider : IKeyVaultProvider
    {
        private readonly IKeyVaultClient keyVaultClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="KeyVaultProvider"/> class.
        /// </summary>
        /// <param name="keyVaultClientFactory">The key vault client factory.</param>
        public KeyVaultProvider(IKeyVaultClientFactory keyVaultClientFactory)
        {
            keyVaultClientFactory.ShouldNotBeNull(nameof(keyVaultClientFactory));

            this.keyVaultClient = keyVaultClientFactory.Create();
        }

        /// <inheritdoc />
        public async Task<string> GetSecretAsync(string keyVaultName, string secretName)
        {
            keyVaultName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(keyVaultName));
            secretName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(secretName));

            var secret = await this.keyVaultClient
                .GetSecretAsync($"https://{keyVaultName}.vault.azure.net/secrets/{secretName}")
                .ConfigureAwait(false);

            return secret.Value;
        }

        /// <inheritdoc />
        public async Task<string> GetSecretAsync(string keyVaultName, string secretName, string version)
        {
            keyVaultName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(keyVaultName));
            secretName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(secretName));
            version.ShouldNotBeNullEmptyOrWhiteSpace(nameof(version));

            var secret = await this.keyVaultClient
                                   .GetSecretAsync($"https://{keyVaultName}.vault.azure.net", secretName, version)
                                   .ConfigureAwait(false);

            return secret.Value;
        }

        /// <inheritdoc />
        public async Task<IList<SecretItem>> GetSecretVersionsAsync(string keyVaultName, string secretName)
        {
            keyVaultName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(keyVaultName));
            secretName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(secretName));

            var versions = new List<SecretItem>();

            var baseUrl = $"https://{keyVaultName}.vault.azure.net/";

            var results = await this.keyVaultClient
                .GetSecretVersionsAsync(baseUrl, secretName)
                .ConfigureAwait(false);

            var nextLink = results.NextPageLink;

            while (!string.IsNullOrWhiteSpace(nextLink))
            {
                var nextResults = await this.keyVaultClient
                    .GetSecretVersionsNextAsync(results.NextPageLink)
                    .ConfigureAwait(false);

                versions.AddRange(nextResults);

                nextLink = nextResults.NextPageLink == nextLink ? string.Empty : nextResults.NextPageLink;
            }

            return versions;
        }

        /// <inheritdoc />
        public async Task<SecretBundle> CreateSecretAsync(string keyVaultName, string secretName, string secretValue, IDictionary<string, string> tags)
        {
            keyVaultName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(keyVaultName));
            secretName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(secretName));
            secretValue.ShouldNotBeNullEmptyOrWhiteSpace(nameof(secretValue));

            return await this.keyVaultClient.SetSecretAsync($"https://{keyVaultName}.vault.azure.net", secretName, secretValue, tags)
                .ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<SecretBundle> DisableSecretAsync(string keyVaultName, string secretName, string version)
        {
            keyVaultName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(keyVaultName));
            secretName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(secretName));
            version.ShouldNotBeNullEmptyOrWhiteSpace(nameof(version));

            return await this.keyVaultClient.UpdateSecretAsync(vaultBaseUrl: $"https://{keyVaultName}.vault.azure.net", secretName: secretName, secretVersion: version, secretAttributes: new SecretAttributes { Enabled = false })
                .ConfigureAwait(false);
        }
    }
}
