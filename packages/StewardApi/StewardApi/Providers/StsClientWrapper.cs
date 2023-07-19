﻿namespace Turn10.LiveOps.StewardApi.Providers
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Net.Http;
    using System.Security.Cryptography.X509Certificates;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Options;
    using Turn10.Contracts.STS;
    using Turn10.Contracts.STS.Responses;
    using Turn10.Data.Common;
    using Turn10.Data.SecretProvider;
    using Turn10.LiveOps.StewardApi.Common;
    using Turn10.LiveOps.StewardApi.Contracts.STS;

    /// <inheritdoc/>
    public sealed class StsClientWrapper : IStsClient
    {
        private static readonly SemaphoreSlim ClientLock = new SemaphoreSlim(1, 1);

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            "Sts:Url",
        };

        private readonly STSClient stsClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="StsClientWrapper"/> class.
        /// </summary>
        [SuppressMessage("Usage", "VSTHRD002:Avoid problematic synchronous waits", Justification = "Constructor")]
        public StsClientWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IHttpClientFactory factory)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            configuration.ShouldContainSettings(RequiredSettings);

            var stsUrl = configuration[ConfigurationKeyConstants.StsUrl];

            this.stsClient = new STSClient(new STSClientOptionsWrapper(new Uri(stsUrl)), factory);
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

        public static X509Certificate2 ConvertToCertificate(string certificateSecret)
        {
            certificateSecret.ShouldNotBeNullEmptyOrWhiteSpace(nameof(certificateSecret));

            var privateKeyBytes = Convert.FromBase64String(certificateSecret);
            privateKeyBytes.ShouldNotBeNull(nameof(privateKeyBytes));

            return new X509Certificate2(privateKeyBytes);
        }
    }
}
