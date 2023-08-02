using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
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

namespace Turn10.LiveOps.StewardApi.Providers.Opus.ServiceConnections
{
    /// <inheritdoc />
    public sealed class OpusServiceWrapper : IOpusService
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
        private readonly Client forzaClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="OpusServiceWrapper"/> class.
        /// </summary>
        [SuppressMessage("Usage", "VSTHRD002:Avoid problematic synchronous waits", Justification = "Constructor")]
        public OpusServiceWrapper(IConfiguration configuration, KeyVaultConfig keyVaultConfig)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultConfig.ShouldNotBeNull(nameof(keyVaultConfig));
            configuration.ShouldContainSettings(RequiredSettings);

            this.environmentUri = configuration[ConfigurationKeyConstants.OpusUri];
            this.clientVersion = configuration[ConfigurationKeyConstants.OpusClientVersion];
            this.adminXuid = Convert.ToUInt64(configuration[ConfigurationKeyConstants.OpusAdminXuid], CultureInfo.InvariantCulture);

            var certificateSecret = keyVaultConfig.OpusCertificateSecret;
            this.lspCertificate = this.ConvertToCertificate(certificateSecret);

            this.forzaClient = new Client(
                new CleartextMessageCryptoProvider(),
                new CleartextMessageCryptoProvider(),
                this.lspCertificate,
                true,
                clientVersion: this.clientVersion);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetUserMasterDataByGamerTagOutput> GetUserMasterDataByGamerTagAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var userService = this.GetUserService();

            return await userService.GetUserMasterDataByGamerTag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetUserMasterDataByXuidOutput> GetUserMasterDataByXuidAsync(ulong xuid)
        {
            var userService = this.GetUserService();

            return await userService.GetUserMasterDataByXuid(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<OnlineProfileService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid)
        {
            var onlineProfileService = this.GetOnlineProfileService();

            return await onlineProfileService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<OnlineProfileService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId)
        {
            var onlineProfileService = this.GetOnlineProfileService();

            return await onlineProfileService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<OnlineProfileService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles)
        {
            var onlineProfileService = this.GetOnlineProfileService();

            return await onlineProfileService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        private X509Certificate2 ConvertToCertificate(string certificateSecret)
        {
            certificateSecret.ShouldNotBeNullEmptyOrWhiteSpace(nameof(certificateSecret));

            var privateKeyBytes = Convert.FromBase64String(certificateSecret);
            privateKeyBytes.ShouldNotBeNull(nameof(privateKeyBytes));

            return new X509Certificate2(privateKeyBytes);
        }

        private UserService GetUserService()
        {
            return new UserService(this.forzaClient, this.environmentUri, this.adminXuid, null, false);
        }

        private OnlineProfileService GetOnlineProfileService()
        {
            return new OnlineProfileService(this.forzaClient, this.environmentUri, this.adminXuid, null, false);
        }
    }
}
