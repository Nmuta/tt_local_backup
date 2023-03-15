using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Forza.LiveOps.FH4.Generated;
using Forza.UserGeneratedContent.FH4.Generated;
using Forza.UserInventory.FH4.Generated;
using Forza.WebServices.FH4.Generated;
using AuctionManagementService = Forza.LiveOps.FH4.Generated.AuctionManagementService;
using ForzaUserBanParameters = Forza.WebServices.FH4.Generated.ForzaUserBanParameters;
using GiftingService = Forza.LiveOps.FH4.Generated.GiftingService;
using RareCarShopService = Forza.WebServices.FH4.Generated.RareCarShopService;
using UserInventoryService = Forza.LiveOps.FH4.Generated.UserInventoryService;
using UserManagementService = Forza.LiveOps.FH4.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections
{
    /// <summary>
    ///     Exposes methods for interacting with the Sunrise User Service.
    /// </summary>
    public interface ISunriseService
    {
        /// <summary>
        ///     Gets live ops user data by xuid.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetLiveOpsUserDataByXuidAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Gets the live ops user data by gamerTag.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetLiveOpsUserDataByGamerTagAsync(
            string gamertag,
            string endpoint);

        /// <summary>
        ///     Gets user IDs.
        /// </summary>
        Task<UserManagementService.GetUserIdsOutput> GetUserIdsAsync(
            ForzaPlayerLookupParameters[] parameters,
            string endpoint);

        /// <summary>
        ///     Gets the LSP user groups.
        /// </summary>
        Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets the consoles.
        /// </summary>
        Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(
            ulong xuid,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startIndex,
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
        Task AddProfileNoteAsync(ulong xuid, string text, string author, string endpoint);

        /// <summary>
        ///     Sets the console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint);

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
        ///     Sets is under review flag.
        /// </summary>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview, string endpoint);

        /// <summary>
        ///     Gets the under review flag.
        /// </summary>
        Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets the user group memberships.
        /// </summary>
        Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(
            ulong xuid,
            int[] groupIdFilter,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Adds to user groups.
        /// </summary>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint);

        /// <summary>
        ///     Removes from user groups.
        /// </summary>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint);

        /// <summary>
        ///     Gets user profiles using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(
            ulong xuid,
            uint maxProfiles,
            string endpoint);

        /// <summary>
        ///     Gets user inventory using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Gets user inventory by profileID using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(
            int profileId,
            string endpoint);

        /// <summary>
        ///     Retrieves notifications for a user.
        /// </summary>
        public Task<NotificationsManagementService.LiveOpsRetrieveForUserExOutput> LiveOpsRetrieveForUserAsync(
            ulong xuid,
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
        ///     Retrieves user group messages.
        /// </summary>
        public Task<NotificationsManagementService.GetAllUserGroupMessagesOutput>
            GetUserGroupNotificationsAsync(
                int groupId,
                int maxResults,
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
        public Task<NotificationsManagementService.SendGroupMessageNotificationOutput>
            SendGroupMessageNotificationAsync(
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
        ///     Gets supported gift types using the admin endpoint.
        /// </summary>
        Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Sends item gift using admin endpoint.
        /// </summary>
        Task AdminSendItemGiftAsync(
            ulong recipientXuid,
            InventoryItemType itemType,
            int itemValue,
            string endpoint);

        /// <summary>
        ///     Sends gift to LSP group.
        /// </summary>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue, string endpoint);

        /// <summary>
        ///    Sends car livery to a player xuid.
        /// </summary>
        Task<GiftingService.AdminSendLiveryGiftOutput> SendCarLiveryAsync(ulong[] xuids, Guid liveryId, string endpoint);

        /// <summary>
        ///    Sends car livery to a user group.
        /// </summary>
        Task<GiftingService.AdminSendGroupLiveryGiftOutput> SendCarLiveryAsync(int groupId, Guid liveryId, string endpoint);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<UserService.BanUsersOutput> BanUsersAsync(
            ForzaUserBanParameters[] banParameters,
            string endpoint);

        /// <summary>
        ///     Expires bans.
        /// </summary>
        Task<UserService.ExpireBanEntriesOutput> ExpireBanEntriesAsync(
            ForzaUserExpireBanParameters[] banParameters,
            int entryCount,
            string endpoint);

        /// <summary>
        ///     Deletes bans.
        /// </summary>
        Task<UserService.DeleteBanEntriesOutput> DeleteBanEntriesAsync(
            int[] banParameters,
            string endpoint);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<UserService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets user ban summaries.
        /// </summary>
        Task<UserService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(
            ulong[] xuids,
            int xuidCount,
            string endpoint);

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        Task<AuctionManagementService.SearchAuctionHouseOutput> GetPlayerAuctionsAsync(
            ForzaAuctionFilters filters,
            string endpoint);

        /// <summary>
        ///     Gets comprehensive data about an auction.
        /// </summary>
        Task<Forza.LiveOps.FH4.Generated.ForzaAuction> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint);

        /// <summary>
        ///     Gets auction house block list.
        /// </summary>
        Task<AuctionManagementService.GetAuctionBlocklistOutput> GetAuctionBlockListAsync(int maxResults, string endpoint);

        /// <summary>
        ///     Adds or updates an entry in the auction house block list.
        /// </summary>
        Task AddAuctionBlocklistEntriesAsync(ForzaAuctionBlocklistEntry[] blockEntries, string endpoint);

        /// <summary>
        ///     Removes an entry from the auction house block list.
        /// </summary>
        Task DeleteAuctionBlocklistEntriesAsync(int[] carIds, string endpoint);

        /// <summary>
        ///     Gets token balance.
        /// </summary>
        Task<RareCarShopService.AdminGetTokenBalanceOutput> GetTokenBalanceAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Sets token balance.
        /// </summary>
        Task SetTokenBalanceAsync(ulong xuid, uint newBalance, string endpoint);

        /// <summary>
        ///     Gets token transactions.
        /// </summary>
        Task<RareCarShopService.AdminGetTransactionsOutput> GetTokenTransactionsAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Search player UGC content.
        /// </summary>
        Task<StorefrontManagementService.SearchUGCOutput> SearchUgcContentAsync(
            ForzaUGCSearchRequest filters,
            ForzaUGCContentType contentType,
            string endpoint,
            bool includeThumbnails = false);

        /// <summary>
        ///     Get a player livery.
        /// </summary>
        Task<StorefrontManagementService.GetUGCLiveryOutput> GetPlayerLiveryAsync(
            Guid liveryId,
            string endpoint);

        /// <summary>
        ///     Get a player's UGC by id.
        /// </summary>
        Task<StorefrontManagementService.GetUGCObjectOutput> GetPlayerUgcObjectAsync(
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
    }
}
