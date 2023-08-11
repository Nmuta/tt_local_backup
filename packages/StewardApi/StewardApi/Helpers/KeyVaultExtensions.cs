using System.Threading.Tasks;
using Azure.Security.KeyVault.Secrets;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions to simplify use of KeyVault clients.
    /// </summary>
    public static class KeyVaultExtensions
    {
        /// <summary>Gets the latest version of a named secret.</summary>
        public static async Task<string> GetSecretStringAsync(this SecretClient client, string secretName)
        {
            var secret = await client.GetSecretAsync(secretName).ConfigureAwait(false);
            return secret.Value.Value;
        }
    }
}
