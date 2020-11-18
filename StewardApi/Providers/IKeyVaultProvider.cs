using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.KeyVault.Models;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Provides methods for interacting with Key Vault.
    /// </summary>
    public interface IKeyVaultProvider
    {
        /// <summary>
        ///     Gets the secret.
        /// </summary>
        /// <param name="keyVaultName">The key vault name.</param>
        /// <param name="secretName">The secret name.</param>
        /// <returns>The secret.</returns>
        Task<string> GetSecretAsync(string keyVaultName, string secretName);

        /// <summary>
        ///     Gets all versions of the secret.
        /// </summary>
        /// <param name="keyVaultName">The key vault name.</param>
        /// <param name="secretName">The secret name.</param>
        /// <param name="version">The version.</param>
        /// <returns>The secret.</returns>
        Task<string> GetSecretAsync(string keyVaultName, string secretName, string version);

        /// <summary>
        ///     Gets all versions of the secret.
        /// </summary>
        /// <param name="keyVaultName">The key vault name.</param>
        /// <param name="secretName">The secret name.</param>
        /// <returns>The secret versions.</returns>
        Task<IList<SecretItem>> GetSecretVersionsAsync(string keyVaultName, string secretName);

        /// <summary>
        ///     Creates a secret.
        /// </summary>
        /// <param name="keyVaultName">The key vault name.</param>
        /// <param name="secretName">The secret name.</param>
        /// <param name="secretValue">The secret value.</param>
        /// <param name="tags">The tags.</param>
        /// <returns>The secret bundle.</returns>
        Task<SecretBundle> CreateSecretAsync(string keyVaultName, string secretName, string secretValue, IDictionary<string, string> tags);

        /// <summary>
        ///     Disables the secret.
        /// </summary>
        /// <param name="keyVaultName">The key vault name.</param>
        /// <param name="secretName">The secret name.</param>
        /// <param name="version">The version.</param>
        /// <returns>The secret bundle.</returns>
        Task<SecretBundle> DisableSecretAsync(string keyVaultName, string secretName, string version);
    }
}
