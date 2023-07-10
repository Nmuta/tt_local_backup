using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.Services.ForzaClient;
using RareCarShopService = Forza.WebServices.FH5_main.Generated.RareCarShopService;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

// Allow non-private fields as an abstract class.
#pragma warning disable SA1307
#pragma warning disable SA1401
#pragma warning disable SA1600

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <inheritdoc />
    public abstract class WoodstockServiceFactory : IWoodstockServiceFactory
    {
        internal static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.WoodstockClientVersion,
            ConfigurationKeyConstants.WoodstockAdminXuid,
            ConfigurationKeyConstants.WoodstockSandbox,
            ConfigurationKeyConstants.WoodstockTitleId
        };

        internal string clientVersion;
        internal ulong adminXuid;
        internal string sandbox;
        internal uint titleId;
        internal IRefreshableCacheStore refreshableCacheStore;
        internal IStsClient stsClient;
        internal Client forzaClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockServiceFactory"/> class.
        /// </summary>
        internal WoodstockServiceFactory(
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
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.UserManagementService> PrepareUserManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new ServicesLiveOps.UserManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.UserInventoryManagementService> PrepareUserInventoryManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new ServicesLiveOps.UserInventoryManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.GiftingManagementService> PrepareGiftingManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new ServicesLiveOps.GiftingManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
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
        public async Task<ServicesLiveOps.NotificationsManagementService> PrepareNotificationsManagementServiceAsync(
            string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new ServicesLiveOps.NotificationsManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.AuctionManagementService> PrepareAuctionManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new ServicesLiveOps.AuctionManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.StorefrontManagementService> PrepareStorefrontManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new ServicesLiveOps.StorefrontManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.ScoreboardManagementService> PrepareScoreboardManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new ServicesLiveOps.ScoreboardManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
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
