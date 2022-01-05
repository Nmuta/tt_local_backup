using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Contracts.STS.Responses;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <inheritdoc/>
    public sealed class StsClientWrapper : IStsClient
    {
        private static readonly SemaphoreSlim ClientLock = new SemaphoreSlim(1, 1);

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            "Sts:Url",
            "Sts:SecretName"
        };

        private readonly STSClient stsClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="StsClientWrapper"/> class.
        /// </summary>
        [SuppressMessage("Usage", "VSTHRD002:Avoid problematic synchronous waits", Justification = "Constructor")]
        public StsClientWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            configuration.ShouldContainSettings(RequiredSettings);

            var keyVaultUrl = configuration[ConfigurationKeyConstants.KeyVaultUrl];
            var stsUrl = configuration[ConfigurationKeyConstants.StsUrl];
            var keyVaultCertificateName = configuration[ConfigurationKeyConstants.StsSecretName];
            var certificateSecret = keyVaultProvider.GetSecretAsync(keyVaultUrl, keyVaultCertificateName).GetAwaiter().GetResult();

            var stsForgeryCertificate = this.ConvertToCertificate(certificateSecret);
            this.stsClient = new STSClient(new Uri(stsUrl), null, stsForgeryCertificate);
        }

        /// <inheritdoc/>
        public async Task<GetUserTokenResponse> ForgeUserTokenAsync(TokenForgeryRequest tokenForgeryRequest)
        {
            tokenForgeryRequest.ShouldNotBeNull(nameof(tokenForgeryRequest));

            await ClientLock.WaitAsync().ConfigureAwait(false);

            try
            {
                var x = await this.stsClient.ForgeUserToken(tokenForgeryRequest).ConfigureAwait(false);

                return x;
            }
            finally
            {
                ClientLock.Release();
            }
        }

        private X509Certificate2 ConvertToCertificate(string certificateSecret)
        {
            certificateSecret.ShouldNotBeNullEmptyOrWhiteSpace(nameof(certificateSecret));

            var privateKeyBytes = Convert.FromBase64String(certificateSecret);
            privateKeyBytes.ShouldNotBeNull(nameof(privateKeyBytes));

            return new X509Certificate2(privateKeyBytes);
        }
    }
}
