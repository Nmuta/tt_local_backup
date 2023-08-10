using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Helpers;

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

        private AllSecretVersions StewardApiKeyShared { get; set; }

        private AllSecretVersions StewardApiKeyPlayFab { get; set; }
        public AllSecretVersions StewardApiKeyTesting { get; set; }

        /// <summary>
        ///     A set of composite keys structured like "specific-guid|shared-guid" which are valid for PlayFab endpoints.
        /// </summary>
        public AllSecretVersions ApiKeyPlayFabComposite { get; set; }

        /// <summary>
        ///     A set of composite keys structured like "specific-guid|shared-guid" which are valid for Testing endpoints.
        /// </summary>
        public AllSecretVersions ApiKeyTestingComposite { get; set; }

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
                async () => keyVault.StewardApiKeyShared = await GetSecretsInternalAsync(nameof(keyVault.StewardApiKeyShared)).ConfigureAwait(false),
                async () => keyVault.StewardApiKeyPlayFab = await GetSecretsInternalAsync(nameof(keyVault.StewardApiKeyPlayFab)).ConfigureAwait(false),
                async () => keyVault.StewardApiKeyTesting = await GetSecretsInternalAsync(nameof(keyVault.StewardApiKeyTesting)).ConfigureAwait(false),
            };

            var tasks = operations.Select(o => o());
            await Task.WhenAll(tasks).ConfigureAwait(false);

            keyVault.ApiKeyPlayFabComposite = AllSecretVersions.Merge(keyVault.StewardApiKeyPlayFab, keyVault.StewardApiKeyShared);
            keyVault.ApiKeyTestingComposite = AllSecretVersions.Merge(keyVault.StewardApiKeyTesting, keyVault.StewardApiKeyShared);
            keyVault.All = AllSecretVersions.Collect(
                keyVault.ApiKeyPlayFabComposite,
                keyVault.ApiKeyTestingComposite);

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
                    return this.ApiKeyPlayFabComposite;
                case ApiKey.Testing:
                    return this.ApiKeyTestingComposite;
                default:
                    throw new ArgumentException($"Unacceptable {nameof(apiKey)}");
            }
        }

        public class AllSecretVersions
        {
            public HashSet<string> Active { get; set; }

            public static AllSecretVersions Merge(AllSecretVersions left, AllSecretVersions right)
            {
                var merged = new AllSecretVersions { Active = new HashSet<string>() };

                foreach (var leftEntry in left.Active)
                {
                    foreach (var rightEntry in right.Active)
                    {
                        merged.Active.Add($"{leftEntry}|{rightEntry}");
                    }
                }

                return merged;
            }

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
            Unset = 0,
            PlayFab,
            Testing,
        }
    }
}
