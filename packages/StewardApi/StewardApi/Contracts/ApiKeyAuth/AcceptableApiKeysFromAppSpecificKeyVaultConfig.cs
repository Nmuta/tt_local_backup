using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Configuration;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Helpers;

#pragma warning disable CA1034 // Nested types should not be visible

namespace Turn10.LiveOps.StewardApi.Contracts.ApiKeyAuth
{
    /// <summary>
    ///     Container for a set of acceptable API Keys from KeyVault.
    /// </summary>
    public class AcceptableApiKeysFromAppSpecificKeyVaultConfig
    {
        /// <summary>
        ///     True when all secrets have been successfully loaded.
        /// </summary>
        public bool IsInitialized { get; set; } = false;

        private AllSecretVersions StewardApiKeyPlayFab { get; set; }

        public AllSecretVersions StewardApiKeyTesting { get; set; }

        /// <summary>
        ///     A set of all composite keys structured like "specific-guid|shared-guid" which are valid.
        /// </summary>
        public AllSecretVersions All { get; set; }

        public static async Task<AcceptableApiKeysFromAppSpecificKeyVaultConfig> FromKeyVaultUrlAsync(IConfiguration configuration)
        {
            var initializationFailures = new List<Tuple<string, Exception>>();
            var keyVault = new AcceptableApiKeysFromAppSpecificKeyVaultConfig();

            var keyVaultUrl = $"https://{configuration[ConfigurationKeyConstants.KeyVaultUrl]}.vault.azure.net/";
            var client = new SecretClient(
                new Uri(keyVaultUrl),
                AzureCredentials.BetterDefaultAzureCredentials);

            async Task<AllSecretVersions> GetSecretsInternalAsync(string secretName)
            {
                try
                {
                    var activeVersions = await client.GetAllEnabledVersionsAsync(secretName);

                    var activeVersionsTasks = activeVersions.Select(v => client.GetSecretAsync(secretName, v.Version));
                    await Task.WhenAll(activeVersionsTasks);

                    var activeVersionsValues = activeVersionsTasks.Select(v => v.Result.Value.Value).ToList();

                    return new AllSecretVersions
                    {
                        Active = new HashSet<string>(activeVersionsValues),
                    };
                }
                catch (Exception ex)
                {
                    initializationFailures.Add(new Tuple<string, Exception>(secretName, ex));
                    return default;
                }
            }

            // Each of these operations is run in parallel to get the secrets while collecting individual errors,
            // then the errors are collected an a new exeception is thrown.
            var operations = new Func<Task>[]
            {
                async () => keyVault.StewardApiKeyPlayFab = await GetSecretsInternalAsync(nameof(keyVault.StewardApiKeyPlayFab)).ConfigureAwait(false),
                async () => keyVault.StewardApiKeyTesting = await GetSecretsInternalAsync(nameof(keyVault.StewardApiKeyTesting)).ConfigureAwait(false),
            };

            var tasks = operations.Select(o => o());
            await Task.WhenAll(tasks).ConfigureAwait(false);

            keyVault.All = AllSecretVersions.Collect(
                keyVault.StewardApiKeyPlayFab,
                keyVault.StewardApiKeyTesting);

            if (initializationFailures.Any())
            {
                var missingSecrets = string.Join(", ", initializationFailures.Select(t => t.Item1));
                var exceptions = initializationFailures.Select(t => t.Item2);
                throw new AggregateException($"{keyVaultUrl} - unretrievable secrets: {missingSecrets}", exceptions);
            }

            keyVault.IsInitialized = true;

            return keyVault;
        }

        public AllSecretVersions GetAcceptableApiKeys(ApiKey apiKey)
        {
            switch (apiKey)
            {
                case ApiKey.PlayFab:
                    return this.StewardApiKeyPlayFab;
                case ApiKey.Testing:
                    return this.StewardApiKeyTesting;
                default:
                    throw new ArgumentException($"Unacceptable {nameof(apiKey)}");
            }
        }

        public class AllSecretVersions
        {
            public HashSet<string> Active { get; set; }

            public static AllSecretVersions Collect(params AllSecretVersions[] allRegistered)
            {
                var collected = new AllSecretVersions { Active = new HashSet<string>() };
                foreach (var set in allRegistered)
                {
                    foreach (var entry in set.Active)
                    {
                        collected.Active.Add(entry);
                    }
                }

                return collected;
            }
        }

        public enum ApiKey
        {
            [Description("Unset")]
            Unset = 0,
            [Description("PlayFab")]
            PlayFab,
            [Description("Testing")]
            Testing,
        }
    }
}
