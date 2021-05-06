using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Forza.LiveOps.FH5_master.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <inheritdoc />
    public sealed class WoodstockUserInventoryServiceWrapper : IWoodstockUserInventoryService
    {
        private const string AuthTokenKey = "WoodstockServiceAuthToken";

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.WoodstockUri,
            ConfigurationKeyConstants.WoodstockClientVersion,
            ConfigurationKeyConstants.WoodstockAdminXuid,
            ConfigurationKeyConstants.WoodstockSandbox,
            ConfigurationKeyConstants.WoodstockTitleId
        };

        private readonly string environmentUri;
        private readonly string clientVersion;
        private readonly ulong adminXuid;
        private readonly string sandbox;
        private readonly uint titleId;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IStsClient stsClient;

        /// <summary>
        ///      Initializes a new instance of the <see cref="WoodstockUserInventoryServiceWrapper"/> class.
        /// </summary>
        public WoodstockUserInventoryServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IStsClient stsClient)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            stsClient.ShouldNotBeNull(nameof(stsClient));
            configuration.ShouldContainSettings(RequiredSettings);

            this.refreshableCacheStore = refreshableCacheStore;
            this.stsClient = stsClient;

            this.environmentUri = configuration[ConfigurationKeyConstants.WoodstockUri];
            this.clientVersion = configuration[ConfigurationKeyConstants.WoodstockClientVersion];
            this.adminXuid = Convert.ToUInt64(configuration[ConfigurationKeyConstants.WoodstockAdminXuid], CultureInfo.InvariantCulture);
            this.sandbox = configuration[ConfigurationKeyConstants.WoodstockSandbox];
            this.titleId = Convert.ToUInt32(configuration[ConfigurationKeyConstants.WoodstockTitleId], CultureInfo.InvariantCulture);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid)
        {
            var userService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId)
        {
            var userService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles)
        {
            var userService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        private async Task<UserInventoryService> PrepareUserInventoryServiceAsync()
        {
            var forzaClient = new Client(new CleartextMessageCryptoProvider(), new CleartextMessageCryptoProvider(), clientVersion: this.clientVersion);
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserInventoryService(forzaClient, this.environmentUri, this.adminXuid, authToken, false);
        }

        private async Task<string> GetAuthTokenAsync()
        {
            var tokenForgeryParameters = new TokenForgeryRequest
            {
                AgeGroup = "2",
                CountryCode = 103,
                DeviceId = "65535",
                DeviceRegion = "1",
                DeviceType = "WindowsOneCore",
                TitleId = this.titleId,
                TitleVersion = this.clientVersion,
                Gamertag = "UNKNOWN",
                Sandbox = this.sandbox,
                TokenLifetimeMinutes = 60,
                Xuid = this.adminXuid
            };

            var result = await this.stsClient.ForgeUserTokenAsync(tokenForgeryParameters).ConfigureAwait(false);
            this.refreshableCacheStore.PutItem(AuthTokenKey, TimeSpan.FromMinutes(55), result.Token);

            return result.Token;
        }

    }
}
