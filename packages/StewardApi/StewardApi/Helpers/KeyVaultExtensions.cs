using Azure.Security.KeyVault.Certificates;
using Azure.Security.KeyVault.Secrets;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Linq;
using System;

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

        /// <summary>Gets the latest version of a named certificate.</summary>
        public static async Task<X509Certificate2> GetCertificateByLatestAsync(this CertificateClient client, string name)
        {
            var secret = await client.DownloadCertificateAsync(name);
            if (secret == null)
            {
                throw new CryptographicException($"No suitable cert found ({name} @ latest)");
            }

            var x509 = secret.Value;
            if (!x509.HasPrivateKey)
            {
                throw new CryptographicException($"Private key wasn't stored for cert ({name})");
            }

            return x509;
        }

        /// <summary>Gets an enabled version of a named certificate, where the thumbprint matches.</summary>
        public static async Task<X509Certificate2> GetCertificateByThumbprintAsync(this CertificateClient client, string name, string thumbprint)
        {
            var versions = await client.GetAllEnabledVersionsAsync(name);
            var certCandidate = versions.FirstOrDefault(cert =>
            {
                var certThumbprint = BitConverter.ToString(cert.X509Thumbprint).Replace("-", "");
                return thumbprint.Equals(certThumbprint, StringComparison.OrdinalIgnoreCase);
            });

            if (certCandidate == null)
            {
                throw new CryptographicException($"No suitable cert version found ({name} @ {thumbprint})");
            }

            if (!(certCandidate.Enabled ?? false))
            {
                throw new CryptographicException($"Found cert version ({name} @ {thumbprint}) but it is not enabled");
            }

            var result = await client.DownloadCertificateAsync(name, certCandidate.Version);
            if (result == null)
            {
                throw new CryptographicException($"Could not download cert ({name} @ {thumbprint})");
            }

            var x509 = result.Value;
            if (!x509.HasPrivateKey)
            {
                throw new CryptographicException($"Private key wasn't stored for cert ({name})");
            }

            return x509;
        }

        /// <summary>Gets the latest version of a named certificate.</summary>
        public static async Task<X509Certificate2> GetCertificateByLatestExportableAsync(this CertificateClient client, string name)
        {
            var target = new DownloadCertificateOptions(name)
            {
                KeyStorageFlags = X509KeyStorageFlags.DefaultKeySet | X509KeyStorageFlags.Exportable,
            };
            var secret = await client.DownloadCertificateAsync(target);
            if (secret == null)
            {
                throw new CryptographicException($"No suitable cert found ({name} @ latest)");
            }

            var x509 = secret.Value;
            if (!x509.HasPrivateKey)
            {
                throw new CryptographicException($"Private key wasn't stored for cert ({name})");
            }

            return x509;
        }

        /// <summary>Gets an enabled version of a named certificate, where the thumbprint matches.</summary>
        public static async Task<X509Certificate2> GetCertificateByThumbprintExportableAsync(this CertificateClient client, string name, string thumbprint)
        {
            var versions = await client.GetAllEnabledVersionsAsync(name);
            var certCandidate = versions.FirstOrDefault(cert =>
            {
                var certThumbprint = BitConverter.ToString(cert.X509Thumbprint).Replace("-", "");
                return thumbprint.Equals(certThumbprint, StringComparison.OrdinalIgnoreCase);
            });

            if (certCandidate == null)
            {
                throw new CryptographicException($"No suitable cert version found ({name} @ {thumbprint})");
            }

            if (!(certCandidate.Enabled ?? false))
            {
                throw new CryptographicException($"Found cert version ({name} @ {thumbprint}) but it is not enabled");
            }

            var target = new DownloadCertificateOptions(name)
            {
                Version = certCandidate.Version,
                KeyStorageFlags = X509KeyStorageFlags.DefaultKeySet | X509KeyStorageFlags.Exportable,
            };
            var result = await client.DownloadCertificateAsync(target);

            if (result == null)
            {
                throw new CryptographicException($"Could not download cert ({name} @ {thumbprint})");
            }

            var x509 = result.Value;
            if (!x509.HasPrivateKey)
            {
                throw new CryptographicException($"Private key wasn't stored for cert ({name})");
            }

            return x509;
        }
    }
}
