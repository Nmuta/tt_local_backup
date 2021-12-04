using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Forza.LiveOps.FH5.Generated;
using Forza.UserInventory.FH5.Generated;
using Forza.WebServices.FH5.Generated;
using GiftingService = Forza.LiveOps.FH5.Generated.GiftingService;
using NotificationsManagementService = Forza.LiveOps.FH5.Generated.NotificationsManagementService;
using RareCarShopService = Forza.WebServices.FH5.Generated.RareCarShopService;
using UserInventoryService = Forza.LiveOps.FH5.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <summary>
    ///     Exposes methods for interacting with the Woodstock User Service.
    /// </summary>
    public interface IWoodstockService
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
        ///     Gets credit update entries.
        /// </summary>
        Task<LiveOpsService.GetCreditUpdateEntriesOutput> GetCreditUpdateEntriesAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets profile summary.
        /// </summary>
        Task<LiveOpsService.GetProfileSummaryOutput> GetProfileSummaryAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets user IDs.
        /// </summary>
        Task<UserManagementService.GetUserIdsOutput> GetUserIds(
            ForzaPlayerLookupParameters[] parameters,
            string endpoint);

        /// <summary>
        ///     Gets consoles.
        /// </summary>
        Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults, string endpoint);

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
        ///     Gets the user's profile notes.
        /// </summary>
        Task<UserManagementService.GetAdminCommentsOutput> GetProfileNotesAsync(
            ulong xuid,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Adds a note to a user's profile.
        /// </summary>
        Task AddProfileNote(ulong xuid, string text, string author, string endpoint);

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
        ///     Gets supported gift types.
        /// </summary>
        Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypes(
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
        ///     Gets token balance.
        /// </summary>
        Task<RareCarShopService.AdminGetTokenBalanceOutput> GetTokenBalanceAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Sets token balance.
        /// </summary>
        Task SetTokenBalanceAsync(ulong xuid, uint newBalance, string endpoint);

        /// <summary>
        ///     Gets transactions.
        /// </summary>
        Task<RareCarShopService.AdminGetTransactionsOutput> GetTokenTransactionsAsync(ulong xuid, string endpoint);

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
            GetUserGroupNotificationsAsync(
                int groupId,
                int maxResults,
                string endpoint);

        /// <summary>
        ///     Retrieves player messages.
        /// </summary>
        public Task<NotificationsManagementService.GetNotificationOutput> GetPlayerNotificationAsync(
            ulong xuid,
            Guid notificationId,
            string endpoint);

        /// <summary>
        ///     Retrieves user group message.
        /// </summary>
        public Task<NotificationsManagementService.GetUserGroupMessageOutput> GetUserGroupNotificationAsync(
            Guid notificationId,
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
        Task<AuctionManagementService.SearchAuctionHouseOutput> GetPlayerAuctions(ForzaAuctionFilters filters, string endpoint);

        /// <summary>
        ///     Gets comprehensive data about an auction.
        /// </summary>
        Task<Forza.LiveOps.FH5.Generated.ForzaAuction> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint);

        /// <summary>
        ///     Gets auction house block list.
        /// </summary>
        Task<AuctionManagementService.GetAuctionBlocklistOutput> GetAuctionBlockList(int maxResults, string endpoint);

        /// <summary>
        ///     Adds or updates an entry in the auction house block list.
        /// </summary>
        Task AddAuctionBlocklistEntriesAsync(ForzaAuctionBlocklistEntry[] blockEntries, string endpoint);

        /// <summary>
        ///     Removes an entry from the auction house block list.
        /// </summary>
        Task DeleteAuctionBlocklistEntries(int[] carIds, string endpoint);

        /// <summary>
        ///     Search player UGC content.
        /// </summary>
        Task<StorefrontManagementService.SearchUGCOutput> SearchUgcLiveries(
            ForzaUGCSearchRequest filters,
            ForzaUGCContentType contentType,
            string endpoint);

        /// <summary>
        ///     Get a player livery.
        /// </summary>
        Task<StorefrontManagementService.GetUGCLiveryOutput> GetPlayerLivery(
            Guid liveryId,
            string endpoint);

        /// <summary>
        ///     Get a player photo.
        /// </summary>
        Task<StorefrontManagementService.GetUGCPhotoOutput> GetPlayerPhoto(
            Guid photoId,
            string endpoint);

        /// <summary>
        ///     Get a player tune.
        /// </summary>
        Task<StorefrontManagementService.GetUGCTuneOutput> GetPlayerTune(
            Guid tuneId,
            string endpoint);

        /// <summary>
        ///     Sets featured state of a UGC content item.
        /// </summary>
        Task SetUGCFeaturedStatus(
            Guid contentId,
            bool isFeatured,
            DateTime featureEndDate,
            string endpoint);
    }
}
