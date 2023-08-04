using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Common
{
    /// <summary>
    ///     Container for all secrets stored in KeyVault.
    /// </summary>
    public class KeyVaultConfig
    {
        /// <summary>
        /// True when all secrets have been successfully loaded.
        /// </summary>
        public bool IsInitialized { get; set; }

        public string SteelheadContentAccessToken { get; set; }

        public string KustoClientSecret { get; set; }

        public string AzureAuthClientSecret { get; set; }

        public string TeamsHelpChannelWebhook { get; set; }

        public string WoodstockPlayFabDevTitleId { get; set; }

        public string WoodstockPlayFabDevKey { get; set; }

        public string WoodstockPlayFabProdTitleId { get; set; }

        public string WoodstockPlayFabProdKey { get; set; }

        public string BlobConnectionString { get; set; }

        public string ObligationClientSecret { get; set; }

        public string ApolloCertificateSecret { get; set; }

        public string TableStorageConnectionString { get; set; }

        public string SharedTableStorageConnectionString { get; set; }

        public string OpusCertificateSecret { get; set; }

        public static async Task<KeyVaultConfig> FromKeyVaultUrlAsync(IConfiguration configuration)
        {
            var initializationFailures = new List<Tuple<string, Exception>>();
            var keyVault = new KeyVaultConfig();

            var client = new SecretClient(
                new Uri("https://" + configuration[ConfigurationKeyConstants.KeyVaultUrl] + ".vault.azure.net/"),
                new DefaultAzureCredential());

            async Task<string> GetSecretInternalAsync(string secretName)
            {
                try
                {
                    return await client.GetSecretStringAsync(secretName);
                }
                catch (Exception ex)
                {
                    initializationFailures.Add(new Tuple<string, Exception>(secretName, ex));
                    return default;
                }
            }

            // Each of these operations is run in parallel to get the secrets while collecting individual errors,
            // then the errors are collected and a new exeception is thrown.
            var operations = new Func<Task>[] {
                async () => keyVault.SteelheadContentAccessToken = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.SteelheadContentAccessToken]).ConfigureAwait(false),
                async () => keyVault.KustoClientSecret = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.KustoClientSecretName]).ConfigureAwait(false),
                async () => keyVault.AzureAuthClientSecret = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.AzureClientSecretKey]).ConfigureAwait(false),
                async () => keyVault.TeamsHelpChannelWebhook = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.TeamsHelpChannelWebhook]).ConfigureAwait(false),
                async () => keyVault.WoodstockPlayFabDevTitleId = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.WoodstockPlayFabDevTitleId]).ConfigureAwait(false),
                async () => keyVault.WoodstockPlayFabDevKey = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.WoodstockPlayFabDevKey]).ConfigureAwait(false),
                async () => keyVault.BlobConnectionString = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.BlobConnectionSecretName]).ConfigureAwait(false),
                async () => keyVault.ObligationClientSecret = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.ObligationClientSecretName]).ConfigureAwait(false),
                async () => keyVault.ApolloCertificateSecret = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.ApolloCertificateSecretName]).ConfigureAwait(false),
                async () => keyVault.TableStorageConnectionString = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.CosmosTableSecretName]).ConfigureAwait(false),
                async () => keyVault.SharedTableStorageConnectionString = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.CosmosSharedTableSecretName]).ConfigureAwait(false),
                async () => keyVault.OpusCertificateSecret = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.OpusCertificateSecretName]).ConfigureAwait(false),
                async () => keyVault.WoodstockPlayFabProdTitleId = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.WoodstockPlayFabProdTitleId]).ConfigureAwait(false),
                async () => keyVault.WoodstockPlayFabProdKey = await GetSecretInternalAsync(configuration[ConfigurationKeyConstants.WoodstockPlayFabProdKey]).ConfigureAwait(false),
            };

            var tasks = operations.Select(o => o());
            await Task.WhenAll(tasks).ConfigureAwait(false);

            if (initializationFailures.Any())
            {
                var missingSecrets = string.Join(", ", initializationFailures.Select(t => t.Item1));
                var exceptions = initializationFailures.Select(t => t.Item2);
                throw new AggregateException($"{configuration[ConfigurationKeyConstants.KeyVaultUrl]} - unretrievable secrets: {missingSecrets}", exceptions);
            }

            keyVault.IsInitialized = true;

            return keyVault;
        }
    }
}
