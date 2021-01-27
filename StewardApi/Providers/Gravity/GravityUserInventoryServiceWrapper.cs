using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Forza.WebServices.FMG.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using static Forza.WebServices.FMG.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <inheritdoc />
    public sealed class GravityUserInventoryServiceWrapper : IGravityUserInventoryService
    {
        private const string AuthTokenKey = "GravityServiceAuthToken";

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.GravityUri,
            ConfigurationKeyConstants.GravityClientVersion,
            ConfigurationKeyConstants.GravityAdminXuid,
            ConfigurationKeyConstants.GravitySandbox,
            ConfigurationKeyConstants.GravityTitleId
        };

        private readonly string environmentUri;
        private readonly string clientVersion;
        private readonly ulong adminXuid;
        private readonly string sandbox;
        private readonly uint titleId;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IStsClient stsClient;

        /// <summary>
        ///      Initializes a new instance of the <see cref="GravityUserInventoryServiceWrapper"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        /// <param name="refreshableCacheStore">The refreshable cache store.</param>
        /// <param name="stsClient">The STS client.</param>
        public GravityUserInventoryServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IStsClient stsClient)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            stsClient.ShouldNotBeNull(nameof(stsClient));
            configuration.ShouldContainSettings(RequiredSettings);

            this.refreshableCacheStore = refreshableCacheStore;
            this.stsClient = stsClient;

            this.environmentUri = configuration[ConfigurationKeyConstants.GravityUri];
            this.clientVersion = configuration[ConfigurationKeyConstants.GravityClientVersion];
            this.adminXuid = Convert.ToUInt64(configuration[ConfigurationKeyConstants.GravityAdminXuid], CultureInfo.InvariantCulture);
            this.sandbox = configuration[ConfigurationKeyConstants.GravitySandbox];
            this.titleId = Convert.ToUInt32(configuration[ConfigurationKeyConstants.GravityTitleId], CultureInfo.InvariantCulture);
        }

        /// <inheritdoc />
        public async Task LiveOpsApplyUserInventoryByT10IdAsync(string t10Id, LiveOpsUserInventory inventoryToApply, bool shouldResetFirst, bool grantStartingPackage, bool preserveBookingItems)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            inventoryToApply.ShouldNotBeNull(nameof(inventoryToApply));

            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            await userInventoryService.LiveOpsApplyUserInventoryByT10Id(t10Id, inventoryToApply, shouldResetFirst, grantStartingPackage, preserveBookingItems).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsGetInventoryByProfileIdOutput> LiveOpsGetInventoryByProfileIdAsync(string t10Id, string profileId)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            profileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(profileId));

            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.LiveOpsGetInventoryByProfileId(t10Id, profileId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsGetUserInventoryOutput> LiveOpsGetUserInventoryAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.LiveOpsGetUserInventory(t10Id).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsGetUserInventoryByT10IdOutput> LiveOpsGetUserInventoryByT10IdAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.LiveOpsGetUserInventoryByT10Id(t10Id).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task LiveOpsApplyUserInventoryAsync(string t10Id, LiveOpsUserInventory inventoryToApply, bool shouldResetFirst, bool grantStartingPackage, bool preserveBookingItems)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            inventoryToApply.ShouldNotBeNull(nameof(inventoryToApply));

            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            await userInventoryService.LiveOpsApplyUserInventory(t10Id, inventoryToApply, shouldResetFirst, grantStartingPackage, preserveBookingItems).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task ResetUserInventoryAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            await userInventoryService.ResetUserInventory(t10Id).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<GrantItemOutput> GrantItem(string t10Id, ForzaUserInventoryItemType type, int id, int quantity)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            if (type == ForzaUserInventoryItemType.Pack || type == ForzaUserInventoryItemType.ReviveKit || type == ForzaUserInventoryItemType.Chest || type == ForzaUserInventoryItemType.XBLSignInReward || type == ForzaUserInventoryItemType.EnumCount)
            {
                throw new ArgumentException($"Invalid ForzaUserInventoryItemType: {type}");
            }

            if (quantity <= 0)
            {
                throw new ArgumentException($"Quantity must be greater than zero. Quantity provided was: {quantity}");
            }

            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.GrantItem(t10Id, type, id, quantity).ConfigureAwait(false);
        }

        private async Task<UserInventoryService> PrepareUserInventoryServiceAsync()
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                                ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserInventoryService(this.environmentUri, this.adminXuid, authToken, false);
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
