using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Forza.LiveOps.FH5.Generated;
using Forza.UserGeneratedContent.FH5.Generated;
using Forza.UserInventory.FH5.Generated;
using Forza.WebServices.FH5.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using static Forza.WebServices.FH5.Generated.StorefrontService;
using GiftingService = Forza.LiveOps.FH5.Generated.GiftingService;
using NotificationsManagementService = Forza.LiveOps.FH5.Generated.NotificationsManagementService;
using RareCarShopService = Forza.WebServices.FH5.Generated.RareCarShopService;
using UserInventoryService = Forza.LiveOps.FH5.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <inheritdoc />
    public sealed class WoodstockServiceFactory : IWoodstockServiceFactory
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.WoodstockClientVersion,
            ConfigurationKeyConstants.WoodstockAdminXuid,
            ConfigurationKeyConstants.WoodstockSandbox,
            ConfigurationKeyConstants.WoodstockTitleId
        };

        private readonly string clientVersion;
        private readonly ulong adminXuid;
        private readonly string sandbox;
        private readonly uint titleId;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IStsClient stsClient;
        private readonly Client forzaClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockServiceFactory"/> class.
        /// </summary>
        public WoodstockServiceFactory(
            IConfiguration configuration,
            IKeyVaultProvider keyVaultProvider,
            IRefreshableCacheStore refreshableCacheStore,
            IStsClient stsClient)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            stsClient.ShouldNotBeNull(nameof(stsClient));
            configuration.ShouldContainSettings(RequiredSettings);

            this.refreshableCacheStore = refreshableCacheStore;
            this.stsClient = stsClient;

            this.clientVersion = configuration[ConfigurationKeyConstants.WoodstockClientVersion];
            this.adminXuid = Convert.ToUInt64(
                configuration[ConfigurationKeyConstants.WoodstockAdminXuid],
                CultureInfo.InvariantCulture);
            this.sandbox = configuration[ConfigurationKeyConstants.WoodstockSandbox];
            this.titleId = Convert.ToUInt32(
                configuration[ConfigurationKeyConstants.WoodstockTitleId],
                CultureInfo.InvariantCulture);

            this.forzaClient = new Client(
                new CleartextMessageCryptoProvider(),
                new CleartextMessageCryptoProvider(),
                clientVersion: this.clientVersion);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService> PrepareUserManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<LiveOpsService> PrepareUserLookupServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new LiveOpsService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService> PrepareUserInventoryServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserInventoryService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<GiftingService> PrepareGiftingServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new GiftingService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<LiveOpsService> PrepareLiveOpsServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new LiveOpsService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<RareCarShopService> PrepareRareCarShopServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new RareCarShopService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService> PrepareNotificationsManagementServiceAsync(
            string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new NotificationsManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<AuctionManagementService> PrepareAuctionManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new AuctionManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontManagementService> PrepareStorefrontManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new StorefrontManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontService> PrepareStorefrontServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new StorefrontService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
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
            this.refreshableCacheStore.PutItem(WoodstockCacheKey.MakeAuthTokenKey(), TimeSpan.FromMinutes(55), result.Token);

            return result.Token;
        }
    }
}
