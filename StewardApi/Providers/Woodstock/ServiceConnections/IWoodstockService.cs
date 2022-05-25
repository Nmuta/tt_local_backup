using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Forza.UserGeneratedContent.FH5_main.Generated;
using Forza.UserInventory.FH5_main.Generated;
using Forza.WebServices.FH5_main.Generated;
using RareCarShopService = Forza.WebServices.FH5_main.Generated.RareCarShopService;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

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
        Task<LiveOpsService.GetLiveOpsUserDataByXuidV2Output> GetUserDataByXuidAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets user data by gamertag.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByGamerTagV2Output> GetUserDataByGamertagAsync(
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
        Task<ServicesLiveOps.UserManagementService.GetUserIdsOutput> GetUserIdsAsync(
            ServicesLiveOps.ForzaPlayerLookupParameters[] parameters,
            string endpoint);

        /// <summary>
        ///     Gets consoles.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService.GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults, string endpoint);

        /// <summary>
        ///     Sets console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startAt,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets the user's profile notes.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService.GetAdminCommentsOutput> GetProfileNotesAsync(
            ulong xuid,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Adds a note to a user's profile.
        /// </summary>
        Task AddProfileNoteAsync(ulong xuid, string text, string author, string endpoint);

        /// <summary>
        ///     Gets LSP groups.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets user group memberships.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(
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
        Task<ServicesLiveOps.UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Sets is under review.
        /// </summary>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview, string endpoint);

        /// <summary>
        ///     Gets user ban summaries.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(
            ulong[] xuids,
            string endpoint);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService.BanUsersOutput> BanUsersAsync(
            ServicesLiveOps.ForzaUserBanParameters[] banParameters,
            int xuidCount,
            string endpoint);

        /// <summary>
        ///     Expires bans.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService.ExpireBanEntriesOutput> ExpireBanEntriesAsync(
            ServicesLiveOps.ForzaUserExpireBanParameters[] banParameters,
            int entryCount,
            string endpoint);

        /// <summary>
        ///     Deletes bans.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService.DeleteBanEntriesOutput> DeleteBanEntriesAsync(
            int[] banParameters,
            string endpoint);

        /// <summary>
        ///     Gets user inventory.
        /// </summary>
        Task<LiveOpsService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Gets user inventory by profile ID.
        /// </summary>
        Task<LiveOpsService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(
            int profileId,
            string endpoint);

        /// <summary>
        ///     Gets user inventory profiles.
        /// </summary>
        Task<ServicesLiveOps.UserInventoryManagementService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(
            ulong xuid,
            uint maxProfiles,
            string endpoint);

        /// <summary>
        ///     Gets supported gift types.
        /// </summary>
        Task<ServicesLiveOps.GiftingManagementService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(
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
        ///    Sends car livery to a player xuid.
        /// </summary>
        Task<ServicesLiveOps.GiftingManagementService.AdminSendLiveryGiftOutput> SendCarLiveryAsync(ulong[] xuids, Guid liveryId, string endpoint);

        /// <summary>
        ///    Sends car livery to a user group.
        /// </summary>
        Task<ServicesLiveOps.GiftingManagementService.AdminSendGroupLiveryGiftOutput> SendCarLiveryAsync(int groupId, Guid liveryId, string endpoint);

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
        public Task<ServicesLiveOps.NotificationsManagementService.LiveOpsRetrieveForUserOutput> LiveOpsRetrieveForUserAsync(
            ulong xuid,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Retrieves user group messages.
        /// </summary>
        public Task<ServicesLiveOps.NotificationsManagementService.GetAllUserGroupMessagesOutput>
            GetUserGroupNotificationsAsync(
                int groupId,
                int maxResults,
                string endpoint);

        /// <summary>
        ///     Retrieves player messages.
        /// </summary>
        public Task<ServicesLiveOps.NotificationsManagementService.GetNotificationOutput> GetPlayerNotificationAsync(
            ulong xuid,
            Guid notificationId,
            string endpoint);

        /// <summary>
        ///     Retrieves user group message.
        /// </summary>
        public Task<ServicesLiveOps.NotificationsManagementService.GetUserGroupMessageOutput> GetUserGroupNotificationAsync(
            Guid notificationId,
            string endpoint);

        /// <summary>
        ///     Sends message to multiple xuids.
        /// </summary>
        Task<ServicesLiveOps.NotificationsManagementService.SendMessageNotificationToMultipleUsersOutput>
            SendMessageNotificationToMultipleUsersAsync(
            IList<ulong> xuids,
            string message,
            DateTime expireTimeUtc,
            string endpoint);

        /// <summary>
        ///     Sends group message.
        /// </summary>
        public Task<ServicesLiveOps.NotificationsManagementService.SendGroupMessageNotificationOutput> SendGroupMessageNotificationAsync(
            int groupId,
            string message,
            DateTime expireTimeUtc,
            ServicesLiveOps.ForzaLiveDeviceType deviceType,
            string endpoint);

        /// <summary>
        ///     Edits notification.
        /// </summary>
        public Task EditNotificationAsync(
            Guid notificationId,
            ulong xuid,
            ServicesLiveOps.ForzaCommunityMessageNotificationEditParameters messageParams,
            string endpoint);

        /// <summary>
        ///     Edits group notification.
        /// </summary>
        public Task EditGroupNotificationAsync(
            Guid notificationId,
            ServicesLiveOps.ForzaCommunityMessageNotificationEditParameters messageParams,
            string endpoint);

        /// <summary>
        ///     Deletes all of a user's notifications.
        /// </summary>
        Task DeleteAllUserNotificationAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        Task<ServicesLiveOps.AuctionManagementService.SearchAuctionHouseOutput> GetPlayerAuctionsAsync(
            ServicesLiveOps.ForzaAuctionFilters filters,
            string endpoint);

        /// <summary>
        ///     Gets comprehensive data about an auction.
        /// </summary>
        Task<ServicesLiveOps.ForzaAuction> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint);

        /// <summary>
        ///     Deletes an auction.
        /// </summary>
        Task<ServicesLiveOps.AuctionManagementService.DeleteAuctionsOutput> DeleteAuctionAsync(
            Guid auctionId,
            string endpoint);

        /// <summary>
        ///     Gets auction house block list.
        /// </summary>
        Task<ServicesLiveOps.AuctionManagementService.GetAuctionBlocklistOutput> GetAuctionBlockListAsync(int maxResults, string endpoint);

        /// <summary>
        ///     Adds or updates an entry in the auction house block list.
        /// </summary>
        /// <remarks>API is targeting the "live-steward" Pegasus slot.</remarks>
        Task AddAuctionBlocklistEntriesAsync(ServicesLiveOps.ForzaAuctionBlocklistEntry[] blockEntries, string endpoint);

        /// <summary>
        ///     Removes an entry from the auction house block list.
        /// </summary>
        /// <remarks>API is targeting the "live-steward" Pegasus slot.</remarks>
        Task DeleteAuctionBlocklistEntriesAsync(int[] carIds, string endpoint);

        /// <summary>
        ///     Search public and private UGC content for a single player.
        /// </summary>
        Task<ServicesLiveOps.StorefrontManagementService.SearchUGCOutput> SearchUgcContentAsync(
            ServicesLiveOps.ForzaUGCSearchRequest filters,
            ServicesLiveOps.ForzaUGCContentType contentType,
            string endpoint,
            bool includeThumbnails = false);

        /// <summary>
        ///     Get a player livery.
        /// </summary>
        Task<ServicesLiveOps.StorefrontManagementService.GetUGCLiveryOutput> GetPlayerLiveryAsync(
            Guid liveryId,
            string endpoint);

        /// <summary>
        ///     Get a player photo.
        /// </summary>
        Task<ServicesLiveOps.StorefrontManagementService.GetUGCPhotoOutput> GetPlayerPhotoAsync(
            Guid photoId,
            string endpoint);

        /// <summary>
        ///     Get a player tune.
        /// </summary>
        Task<ServicesLiveOps.StorefrontManagementService.GetUGCTuneOutput> GetPlayerTuneAsync(
            Guid tuneId,
            string endpoint);

        /// <summary>
        ///     Get hidden UGC.
        /// </summary>
        Task<StorefrontService.GetHiddenUGCForUserOutput> GetHiddenUgcForUserAsync(
            int maxUgcCount,
            ulong xuid,
            FileType fileType,
            string endpoint);

        /// <summary>
        ///     Hide UGC.
        /// </summary>
        Task HideUgcAsync(Guid ugcId, string endpoint);

        /// <summary>
        ///     Unhide UGC.
        /// </summary>
        Task UnhideUgcAsync(Guid ugcId, ulong xuid, FileType fileType, string endpoint);

        /// <summary>
        ///     Sets featured state of a UGC content item.
        /// </summary>
        Task SetUgcFeaturedStatusAsync(
            Guid contentId,
            bool isFeatured,
            DateTime featureEndDate,
            string endpoint);

        /// <summary>
        ///     Gets leaderboard scores.
        /// </summary>
        Task<IList<ServicesLiveOps.ForzaRankedLeaderboardRow>> GetLeaderboardScoresAsync(
            ServicesLiveOps.ForzaSearchLeaderboardsParameters searchParams,
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Deletes leaderboard scores.
        /// </summary>
        Task DeleteLeaderboardScoresAsync(Guid[] scoreIDs, string endpoint);
    }
}
