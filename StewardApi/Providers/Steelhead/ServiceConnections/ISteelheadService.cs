using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Forza.LiveOps.FM8.Generated;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FM8.Generated;
using GiftingService = Forza.LiveOps.FM8.Generated.GiftingService;
using NotificationsManagementService = Forza.LiveOps.FM8.Generated.NotificationsManagementService;
using UserInventoryService = Forza.LiveOps.FM8.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <summary>
    ///     Exposes methods for interacting with the Steelhead User Service.
    /// </summary>
    public interface ISteelheadService
    {
        /// <summary>
        ///     Gets user data by xuid.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetUserDataByXuidAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets user data by gamertag.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetUserDataByGamertagAsync(
            string gamertag,
            string endpoint);

        /// <summary>
        ///     Gets user IDs.
        /// </summary>
        Task<UserManagementService.GetUserIdsOutput> GetUserIds(
            ForzaPlayerLookupParameters[] parameters,
            string endpoint);

        /// <summary>
        ///     Gets consoles.
        /// </summary>
        Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(
            ulong xuid,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Sets console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startAt,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets LSP groups.
        /// </summary>
        Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets user group memberships.
        /// </summary>
        Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(
            ulong xuid,
            int[] groupFilter,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Removes user from groups.
        /// </summary>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint);

        /// <summary>
        ///     Adds user to groups.
        /// </summary>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint);

        /// <summary>
        ///     Gets is under review.
        /// </summary>
        Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Sets is under review.
        /// </summary>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview, string endpoint);

        /// <summary>
        ///     Gets user ban summaries.
        /// </summary>
        Task<UserManagementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(
            ulong[] xuids,
            string endpoint);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<UserManagementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<UserManagementService.BanUsersOutput> BanUsersAsync(
            ForzaUserBanParameters[] banParameters,
            int xuidCount,
            string endpoint);

        /// <summary>
        ///     Gets user inventory.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Gets user inventory by profile ID.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(
            int profileId,
            string endpoint);

        /// <summary>
        ///     Gets user inventory profiles.
        /// </summary>
        Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(
            ulong xuid,
            uint maxProfiles,
            string endpoint);

        /// <summary>
        ///     Gets supported gift types using the admin endpoint.
        /// </summary>
        Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Sends an item gift.
        /// </summary>
        Task AdminSendItemGiftAsync(ulong xuid, InventoryItemType itemType, int itemValue, string endpoint);

        /// <summary>
        ///     Sends a group item gift.
        /// </summary>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue, string endpoint);

        /// <summary>
        ///     Retrieves notifications for a user.
        /// </summary>
        public Task<NotificationsManagementService.LiveOpsRetrieveForUserExOutput> LiveOpsRetrieveForUserAsync(
            ulong xuid,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Retrieves user group messages.
        /// </summary>
        public Task<NotificationsManagementService.GetAllUserGroupMessagesOutput>
            GetUserGroupNotificationAsync(
                int groupId,
                int maxResults,
                string endpoint);

        /// <summary>
        ///     Sends message to multiple xuids.
        /// </summary>
        Task<NotificationsManagementService.SendMessageNotificationToMultipleUsersOutput>
            SendMessageNotificationToMultipleUsersAsync(
                IList<ulong> xuids,
                string message,
                DateTime expireTimeUtc,
                string endpoint);

        /// <summary>
        ///     Sends group message.
        /// </summary>
        public Task<NotificationsManagementService.SendGroupMessageNotificationOutput> SendGroupMessageNotificationAsync(
            int groupId,
            string message,
            DateTime expireTimeUtc,
            ForzaLiveDeviceType deviceType,
            string endpoint);

        /// <summary>
        ///     Edits notification.
        /// </summary>
        public Task EditNotificationAsync(
            Guid notificationId,
            ulong xuid,
            ForzaCommunityMessageNotificationEditParameters messageParams,
            string endpoint);

        /// <summary>
        ///     Edits group notification.
        /// </summary>
        public Task EditGroupNotificationAsync(
            Guid notificationId,
            ForzaCommunityMessageNotificationEditParameters messageParams,
            string endpoint);

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        Task<AuctionManagementService.SearchAuctionHouseOutput> GetPlayerAuctions(
            ForzaAuctionFilters filters,
            string endpoint);
    }
}
