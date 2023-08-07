using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using AuctionManagementService = Turn10.Services.LiveOps.FM8.Generated.AuctionManagementService;
using GiftingManagementService = Turn10.Services.LiveOps.FM8.Generated.GiftingManagementService;
using LiveOpsService = Forza.WebServices.FM8.Generated.LiveOpsService;
using LocalizationManagementService = Turn10.Services.LiveOps.FM8.Generated.LocalizationManagementService;
using NotificationManagementService = Turn10.Services.LiveOps.FM8.Generated.NotificationsManagementService;
using StorefrontManagementService = Turn10.Services.LiveOps.FM8.Generated.StorefrontManagementService;
using UserInventoryManagementService = Turn10.Services.LiveOps.FM8.Generated.UserInventoryManagementService;
using UserManagementService = Turn10.Services.LiveOps.FM8.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <inheritdoc />
    public class SteelheadServiceFactory : ISteelheadServiceFactory
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.SteelheadClientVersion,
            ConfigurationKeyConstants.SteelheadAdminXuid,
            ConfigurationKeyConstants.SteelheadSandbox,
            ConfigurationKeyConstants.SteelheadTitleId
        };

        private readonly string clientVersion;
        private readonly ulong adminXuid;
        private readonly string sandbox;
        private readonly uint titleId;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IStsClient stsClient;
        private readonly Client forzaClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadServiceFactory"/> class.
        /// </summary>
        public SteelheadServiceFactory(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IStsClient stsClient)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            stsClient.ShouldNotBeNull(nameof(stsClient));
            configuration.ShouldContainSettings(RequiredSettings);

            this.refreshableCacheStore = refreshableCacheStore;
            this.stsClient = stsClient;

            this.clientVersion = configuration[ConfigurationKeyConstants.SteelheadClientVersion];
            this.adminXuid = Convert.ToUInt64(configuration[ConfigurationKeyConstants.SteelheadAdminXuid], CultureInfo.InvariantCulture);
            this.sandbox = configuration[ConfigurationKeyConstants.SteelheadSandbox];
            this.titleId = Convert.ToUInt32(configuration[ConfigurationKeyConstants.SteelheadTitleId], CultureInfo.InvariantCulture);

            this.forzaClient = new Client(new CleartextMessageCryptoProvider(), new CleartextMessageCryptoProvider(), clientVersion: this.clientVersion);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService> PrepareUserManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(SteelheadCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<LiveOpsService> PrepareLiveOpsServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(SteelheadCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new LiveOpsService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryManagementService> PrepareUserInventoryManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(SteelheadCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserInventoryManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<GiftingManagementService> PrepareGiftingManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(SteelheadCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new GiftingManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<NotificationManagementService> PrepareNotificationManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(SteelheadCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new NotificationManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<AuctionManagementService> PrepareAuctionManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(SteelheadCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new AuctionManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<LocalizationManagementService> PrepareLocalizationManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(SteelheadCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new LocalizationManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontManagementService> PrepareStorefrontManagementServiceAsync(string endpoint)
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(SteelheadCacheKey.MakeAuthTokenKey())
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new StorefrontManagementService(this.forzaClient, endpoint, this.adminXuid, authToken, false);
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
            this.refreshableCacheStore.PutItem(SteelheadCacheKey.MakeAuthTokenKey(), TimeSpan.FromMinutes(55), result.Token);

            return result.Token;
        }
    }
}
