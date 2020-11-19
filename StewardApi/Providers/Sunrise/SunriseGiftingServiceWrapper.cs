using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Forza.UserInventory.FH4.master.Generated;
using Forza.WebServices.FH4.master.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using static Forza.WebServices.FH4.master.Generated.GiftingService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunriseGiftingServiceWrapper : ISunriseGiftingService
    {
        private const string AuthTokenKey = "SunriseServiceAuthToken";

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.SunriseUri,
            ConfigurationKeyConstants.SunriseClientVersion,
            ConfigurationKeyConstants.SunriseAdminXuid,
            ConfigurationKeyConstants.SunriseSandbox,
            ConfigurationKeyConstants.SunriseTitleId
        };

        private readonly string environmentUri;
        private readonly string clientVersion;
        private readonly ulong adminXuid;
        private readonly string sandbox;
        private readonly uint titleId;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IStsClient stsClient;

        /// <summary>
        ///      Initializes a new instance of the <see cref="SunriseGiftingServiceWrapper"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        /// <param name="refreshableCacheStore">The refreshable cache store.</param>
        /// <param name="stsClient">The STS client.</param>
        public SunriseGiftingServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IStsClient stsClient)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            stsClient.ShouldNotBeNull(nameof(stsClient));
            configuration.ShouldContainSettings(RequiredSettings);

            this.refreshableCacheStore = refreshableCacheStore;
            this.stsClient = stsClient;

            this.environmentUri = configuration[ConfigurationKeyConstants.SunriseUri];
            this.clientVersion = configuration[ConfigurationKeyConstants.SunriseClientVersion];
            this.adminXuid = Convert.ToUInt64(configuration[ConfigurationKeyConstants.SunriseAdminXuid], CultureInfo.InvariantCulture);
            this.sandbox = configuration[ConfigurationKeyConstants.SunriseSandbox];
            this.titleId = Convert.ToUInt32(configuration[ConfigurationKeyConstants.SunriseTitleId], CultureInfo.InvariantCulture);
        }

        /// <inheritdoc/>
        public async Task AdminSendItemGiftAsync(ulong recipientXuid, InventoryItemType itemType, int itemValue)
        {
            var giftingService = await this.PrepareGiftingServiceAsync().ConfigureAwait(false);

            await giftingService.AdminSendItemGift(recipientXuid, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue)
        {
            var giftingService = await this.PrepareGiftingServiceAsync().ConfigureAwait(false);

            await giftingService.AdminSendItemGroupGift(groupId, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults)
        {
            var giftingService = await this.PrepareGiftingServiceAsync().ConfigureAwait(false);

            return await giftingService.AdminGetSupportedGiftTypes(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AdminSendCarGiftAsync(ulong recipientXuid, int carId)
        {
            var giftingService = await this.PrepareGiftingServiceAsync().ConfigureAwait(false);

            await giftingService.AdminSendCarGift(recipientXuid, carId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AdminSendCreditsGiftAsync(ulong recipientXuid, uint creditAmount, string reason)
        {
            var giftingService = await this.PrepareGiftingServiceAsync().ConfigureAwait(false);

            await giftingService.AdminSendCreditsGift(recipientXuid, creditAmount, reason).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetGiftsForUserOutput> GetGiftsForUserAsync(int startAt, int maxResults)
        {
            var giftingService = await this.PrepareGiftingServiceAsync().ConfigureAwait(false);

            return await giftingService.GetGiftsForUser(startAt, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task MarkItemGiftRetrievedAsync(InventoryItemType itemType, Guid itemGiftId)
        {
            var giftingService = await this.PrepareGiftingServiceAsync().ConfigureAwait(false);

            await giftingService.MarkItemGiftRetrieved(itemType, itemGiftId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<RetrieveCarGiftOutput> RetrieveCarGiftAsync(Guid giftId, uint liveryDetailsBufferSize, uint partsInstalledBufferSize, uint partsInTrunkBufferSize)
        {
            var giftingService = await this.PrepareGiftingServiceAsync().ConfigureAwait(false);

            return await giftingService.RetrieveCarGift(giftId, liveryDetailsBufferSize, partsInstalledBufferSize, partsInTrunkBufferSize).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<RetrieveCreditsGiftOutput> RetrieveCreditsGiftAsync(Guid giftId)
        {
            var giftingService = await this.PrepareGiftingServiceAsync().ConfigureAwait(false);

            return await giftingService.RetrieveCreditsGift(giftId).ConfigureAwait(false);
        }

        private async Task<GiftingService> PrepareGiftingServiceAsync()
        {
            var forzaClient = new Client(new CleartextMessageCryptoProvider(), new CleartextMessageCryptoProvider(), clientVersion: this.clientVersion);
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                                ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new GiftingService(forzaClient, this.environmentUri, this.adminXuid, authToken, false);
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
