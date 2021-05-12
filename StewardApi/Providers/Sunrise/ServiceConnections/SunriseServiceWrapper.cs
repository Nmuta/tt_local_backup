using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Forza.UserInventory.FH4.master.Generated;
using Forza.WebServices.FH4.master.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using EnforcementService = Forza.WebServices.FH4.master.Generated.UserService;
using GiftingService = Forza.WebServices.FH4.master.Generated.GiftingService;
using NotificationsService = Xls.WebServices.FH4.master.Generated.NotificationsService;
using UserInventoryService = Forza.WebServices.FH4.master.Generated.UserInventoryService;
using UserService = Xls.WebServices.FH4.master.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections
{
    /// <inheritdoc />
    public sealed class SunriseServiceWrapper : ISunriseService
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
        private readonly Client forzaClient;

        /// <summary>
        ///      Initializes a new instance of the <see cref="SunriseServiceWrapper"/> class.
        /// </summary>
        public SunriseServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IStsClient stsClient)
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

            this.forzaClient = new Client(new CleartextMessageCryptoProvider(), new CleartextMessageCryptoProvider(), clientVersion: this.clientVersion);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetLiveOpsUserDataByGamerTagOutput> GetLiveOpsUserDataByGamerTagAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetLiveOpsUserDataByGamerTag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetLiveOpsUserDataByXuidOutput> GetLiveOpsUserDataByXuidAsync(ulong xuid)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetLiveOpsUserDataByXuid(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetConsoles(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<object> GetProfileRollbacksAsync(ulong xuid)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            throw new NotImplementedException("Sunrise LSP has not implemented function: GetProfileRollbacksAsync");
        }

        /// <inheritdoc/>
        public async Task<UserService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            await userService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            await userService.SetIsUnderReview(xuid, isUnderReview).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetProfileSummaryOutput> GetProfileSummaryAsync(ulong xuid)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetProfileSummary(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetCreditUpdateEntriesOutput> GetCreditUpdateEntriesAsync(ulong xuid, int startIndex, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetCreditUpdateEntries(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetIsUnderReview(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupIdFilter, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetUserGroupMemberships(xuid, groupIdFilter, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AddToUserGroupsAsync(ulong xuid, int[] groupIds)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            await userService.AddToUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            await userService.RemoveFromUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetUserGroups(startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles)
        {
            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid)
        {
            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId)
        {
            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsService.LiveOpsRetrieveForUserOutput> LiveOpsRetrieveForUserAsync(ulong xuid, int maxResults)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            return await notificationsService.LiveOpsRetrieveForUser(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsService.SendMessageNotificationToMultipleUsersOutput> SendMessageNotificationToMultipleUsersAsync(IList<ulong> xuids, string message, DateTime expireTimeUtc)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            return await notificationsService.SendMessageNotificationToMultipleUsers(xuids.ToArray(), xuids.Count, message, expireTimeUtc).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SendGroupMessageNotificationAsync(int groupId, string message, DateTime expireTimeUtc)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            await notificationsService.SendGroupMessageNotification(groupId, message, expireTimeUtc).ConfigureAwait(false);
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
        public async Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults)
        {
            var giftingService = await this.PrepareGiftingServiceAsync().ConfigureAwait(false);

            return await giftingService.AdminGetSupportedGiftTypes(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<EnforcementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, int xuidCount)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.GetUserBanSummaries(xuids, xuidCount).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<EnforcementService.BanUsersOutput> BanUsersAsync(ulong[] xuids, int xuidCount, ForzaUserBanParameters banParameters)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.BanUsers(xuids, xuidCount, banParameters).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<EnforcementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.GetUserBanHistory(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        private async Task<UserService> PrepareUserServiceAsync()
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                                ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserService(this.forzaClient, this.environmentUri, this.adminXuid, authToken, false);
        }

        private async Task<UserInventoryService> PrepareUserInventoryServiceAsync()
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserInventoryService(this.forzaClient, this.environmentUri, this.adminXuid, authToken, false);
        }

        private async Task<NotificationsService> PrepareNotificationsServiceAsync()
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new NotificationsService(this.forzaClient, this.environmentUri, this.adminXuid, authToken, false);
        }

        private async Task<GiftingService> PrepareGiftingServiceAsync()
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new GiftingService(this.forzaClient, this.environmentUri, this.adminXuid, authToken, false);
        }

        private async Task<EnforcementService> PrepareEnforcementServiceAsync()
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new EnforcementService(this.forzaClient, this.environmentUri, this.adminXuid, authToken, false);
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
