using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.Security.KeyVault.Certificates;
using Azure.Security.KeyVault.Secrets;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions to simplify use of KeyVault clients.
    /// </summary>
    public static class KeyVaultExtensions
    {
        /// <summary>Gets all enabled versions of a named secret.</summary>
        public static async Task<List<SecretProperties>> GetAllEnabledVersionsAsync(this SecretClient client, string name)
        {
            var result = new List<SecretProperties>();
            await foreach (var secret in client.GetPropertiesOfSecretVersionsAsync(name))
            {
                if (secret.Enabled ?? false)
                {
                    result.Add(secret);
                }
            }

            return result;
        }

        /// <summary>Gets all versions (enabled and disabled) of a named certificate.</summary>
        public static async Task<List<CertificateProperties>> GetAllVersionsAsync(this CertificateClient client, string name)
        {
            var result = new List<CertificateProperties>();
            await foreach (var certificate in client.GetPropertiesOfCertificateVersionsAsync(name))
            {
                result.Add(certificate);
            }

            return result;
        }

        /// <summary>Gets all enabled versions of a named certificate.</summary>
        public static async Task<List<CertificateProperties>> GetAllEnabledVersionsAsync(this CertificateClient client, string name)
        {
            var result = new List<CertificateProperties>();
            await foreach (var certificate in client.GetPropertiesOfCertificateVersionsAsync(name))
            {
                if (certificate.Enabled ?? false)
                {
                    result.Add(certificate);
                }
            }

            return result;
        }

        /// <summary>Gets the latest version of a named secret.</summary>
        public static async Task<string> GetSecretStringAsync(this SecretClient client, string secretName)
        {
            var secret = await client.GetSecretAsync(secretName).ConfigureAwait(false);
            return secret.Value.Value;
        }
    }
}
