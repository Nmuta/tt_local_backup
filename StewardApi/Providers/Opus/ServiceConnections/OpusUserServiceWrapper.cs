﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Forza.WebServices.FH3.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using static Forza.WebServices.FH3.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Opus
{
    /// <inheritdoc />
    public sealed class OpusUserServiceWrapper : IOpusUserService
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.OpusUri,
            ConfigurationKeyConstants.OpusClientVersion,
            ConfigurationKeyConstants.OpusAdminXuid,
            ConfigurationKeyConstants.OpusCertificateKeyVaultName,
            ConfigurationKeyConstants.OpusCertificateSecretName
        };

        private readonly string environmentUri;
        private readonly X509Certificate2 lspCertificate;
        private readonly string clientVersion;
        private readonly ulong adminXuid;

        /// <summary>
        ///      Initializes a new instance of the <see cref="OpusUserServiceWrapper"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        public OpusUserServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            configuration.ShouldContainSettings(RequiredSettings);

            this.environmentUri = configuration[ConfigurationKeyConstants.OpusUri];
            this.clientVersion = configuration[ConfigurationKeyConstants.OpusClientVersion];
            this.adminXuid = Convert.ToUInt64(configuration[ConfigurationKeyConstants.OpusAdminXuid], CultureInfo.InvariantCulture);
            var keyVaultName = configuration[ConfigurationKeyConstants.OpusCertificateKeyVaultName];
            var secretName = configuration[ConfigurationKeyConstants.OpusCertificateSecretName];

            var certificateSecret = keyVaultProvider.GetSecretAsync(keyVaultName, secretName).GetAwaiter().GetResult();
            this.lspCertificate = this.ConvertToCertificate(certificateSecret);
        }

        /// <inheritdoc/>
        public async Task<GetUserMasterDataByGamerTagOutput> GetUserMasterDataByGamerTagAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            return await userService.GetUserMasterDataByGamerTag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserMasterDataByXuidOutput> GetUserMasterDataByXuidAsync(ulong xuid)
        {
            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            return await userService.GetUserMasterDataByXuid(xuid).ConfigureAwait(false);
        }

        private X509Certificate2 ConvertToCertificate(string certificateSecret)
        {
            certificateSecret.ShouldNotBeNullEmptyOrWhiteSpace(nameof(certificateSecret));

            var privateKeyBytes = Convert.FromBase64String(certificateSecret);
            privateKeyBytes.ShouldNotBeNull(nameof(privateKeyBytes));

            return new X509Certificate2(privateKeyBytes);
        }

        private Client GetClient()
        {
            return new Client(new CleartextMessageCryptoProvider(), new CleartextMessageCryptoProvider(), this.lspCertificate, true, clientVersion: this.clientVersion);
        }

        private UserService GetUserService(Client forzaClient)
        {
            return new UserService(forzaClient, this.environmentUri, this.adminXuid, null, false);
        }
    }
}
