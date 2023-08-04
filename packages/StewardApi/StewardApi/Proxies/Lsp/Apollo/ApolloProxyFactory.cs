﻿using Forza.WebServices.FM7.Generated;
using System;
using System.Security.Cryptography.X509Certificates;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo.Services;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo
{
    /// <inheritdoc />
    public class ApolloProxyFactory : IApolloProxyFactory
    {
        private readonly X509Certificate2 lspCertificate;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloProxyFactory"/> class.
        /// </summary>
        public ApolloProxyFactory(
            ApolloSettings settingsProvider,
            ForgedCredentialProvider forgedCredentialProvider,
            KeyVaultConfig keyVaultConfig)
        {
            this.Settings = settingsProvider;
            this.ForgedCredentialProvider = forgedCredentialProvider;
            var certificateSecret = keyVaultConfig.ApolloCertificateSecret;
            this.lspCertificate = this.ConvertToCertificate(certificateSecret);

            // TODO: This should also be injected
            this.ForzaClient = new Client(
                new CleartextMessageCryptoProvider(),
                new CleartextMessageCryptoProvider(),
                this.lspCertificate,
                clientVersion: this.Settings.ClientVersion);
        }

        /// <summary>
        ///     Gets the apollo settings.
        /// </summary>
        public ApolloSettings Settings { get; }

        /// <summary>
        ///     Gets the forged credential provider.
        /// </summary>
        public ForgedCredentialProvider ForgedCredentialProvider { get; }

        private Client ForzaClient { get; }

        /// <inheritdoc/>
        public IUserService PrepareUserService(string endpoint)
        {
            var service = new UserService(this.ForzaClient, endpoint, this.Settings.AdminXuid, null, false);
            var serviceProxy = service.ProxyInterface<UserService, IUserService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IUserManagementService PrepareUserManagementService(string endpoint)
        {
            var service = new UserManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, null, false);
            var serviceProxy = service.ProxyInterface<UserManagementService, IUserManagementService>();
            return serviceProxy;
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
