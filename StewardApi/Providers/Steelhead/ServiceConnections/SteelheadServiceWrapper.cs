using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Forza.LiveOps.FM8.Generated;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FM8.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using GiftingService = Forza.LiveOps.FM8.Generated.GiftingService;
using NotificationsManagementService = Forza.LiveOps.FM8.Generated.NotificationsManagementService;
using UserInventoryService = Forza.LiveOps.FM8.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <inheritdoc />
    public sealed class SteelheadServiceWrapper : ISteelheadService
    {
        private readonly ISteelheadServiceFactory serviceFactory;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadServiceWrapper"/> class.
        /// </summary>
        public SteelheadServiceWrapper(ISteelheadServiceFactory steelheadServiceFactory)
        {
            steelheadServiceFactory.ShouldNotBeNull(nameof(steelheadServiceFactory));

            this.serviceFactory = steelheadServiceFactory;
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetUserDataByXuidAsync(ulong xuid, string endpoint)
        {
            var userLookupService = await this.serviceFactory.PrepareUserLookupServiceAsync(endpoint).ConfigureAwait(false);

            return await userLookupService.GetLiveOpsUserDataByXuid(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetUserDataByGamertagAsync(string gamertag, string endpoint)
        {
            var userLookupService = await this.serviceFactory.PrepareUserLookupServiceAsync(endpoint).ConfigureAwait(false);

            return await userLookupService.GetLiveOpsUserDataByGamerTag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetUserIdsOutput> GetUserIdsAsync(ForzaPlayerLookupParameters[] parameters, string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetUserIds(parameters.Length, parameters).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetConsoles(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startAt, int maxResults, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetSharedConsoleUsers(xuid, startAt, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserGroups(startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupFilter, int maxResults, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserGroupMemberships(xuid, groupFilter, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.RemoveFromUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AddToUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.AddToUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetIsUnderReview(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.SetIsUnderReview(xuid, isUnderReview).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserBanSummaries(xuids, xuids.Length).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserBanHistory(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.BanUsersOutput> BanUsersAsync(ForzaUserBanParameters[] banParameters, int xuidCount, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.BanUsers(banParameters, xuidCount).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid, string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserInventoryServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId, string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserInventoryServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles, string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserInventoryServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults, string endpoint)
        {
            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            return await giftingService.AdminGetSupportedGiftTypes(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AdminSendItemGiftAsync(ulong xuid, InventoryItemType itemType, int itemValue, string endpoint)
        {
            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            await giftingService.AdminSendItemGift(xuid, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue, string endpoint)
        {
            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            await giftingService.AdminSendItemGroupGift(groupId, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.LiveOpsRetrieveForUserExOutput> LiveOpsRetrieveForUserAsync(ulong xuid, int maxResults, string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.LiveOpsRetrieveForUserEx(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.GetAllUserGroupMessagesOutput> GetUserGroupNotificationsAsync(
            int groupId,
            int maxResults,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.GetAllUserGroupMessages(groupId, maxResults)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.GetUserGroupMessageOutput> GetUserGroupNotificationAsync(
            Guid notificationId,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.GetUserGroupMessage(notificationId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.SendMessageNotificationToMultipleUsersOutput> SendMessageNotificationToMultipleUsersAsync(IList<ulong> xuids, string message, DateTime expireTimeUtc, string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.SendMessageNotificationToMultipleUsers(xuids.ToArray(), xuids.Count, message, expireTimeUtc).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.SendGroupMessageNotificationOutput> SendGroupMessageNotificationAsync(
            int groupId,
            string message,
            DateTime expireTimeUtc,
            ForzaLiveDeviceType deviceType,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.SendGroupMessageNotification(groupId, message, expireTimeUtc, deviceType != ForzaLiveDeviceType.Invalid, deviceType).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task EditNotificationAsync(
            Guid notificationId,
            ulong xuid,
            ForzaCommunityMessageNotificationEditParameters messageParams,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            await notificationsManagementService.EditNotification(notificationId, xuid, messageParams)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task EditGroupNotificationAsync(
            Guid notificationId,
            ForzaCommunityMessageNotificationEditParameters messageParams,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            await notificationsManagementService.EditGroupNotification(notificationId, messageParams)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<AuctionManagementService.SearchAuctionHouseOutput> GetPlayerAuctionsAsync(ForzaAuctionFilters filters, string endpoint)
        {
            var auctionService = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await auctionService.SearchAuctionHouse(filters).ConfigureAwait(false);
        }
    }
}
