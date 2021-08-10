using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Forza.LiveOps.FH4.Generated;
using Forza.UserInventory.FH4.Generated;
using Forza.WebServices.FH4.Generated;
using AuctionManagementService = Forza.LiveOps.FH4.Generated.AuctionManagementService;
using ForzaUserBanParameters = Forza.LiveOps.FH4.Generated.ForzaUserBanParameters;
using GiftingService = Forza.LiveOps.FH4.Generated.GiftingService;
using NotificationsService = Xls.WebServices.FH4.Generated.NotificationsService;
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
        Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetLiveOpsUserDataByXuidAsync(ulong xuid);

        /// <summary>
        ///     Gets the live ops user data by gamerTag.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetLiveOpsUserDataByGamerTagAsync(string gamertag);

        /// <summary>
        ///     Gets user IDs.
        /// </summary>
        Task<UserManagementService.GetUserIdsOutput> GetUserIds(ForzaPlayerLookupParameters[] parameters);

        /// <summary>
        ///     Gets the LSP user groups.
        /// </summary>
        Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Gets the consoles.
        /// </summary>
        Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Gets the user's profile notes.
        /// </summary>
        Task<UserManagementService.GetAdminCommentsOutput> GetProfileNotesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Adds a note to a user's profile.
        /// </summary>
        Task AddProfileNote(ulong xuid, string text, string author);

        /// <summary>
        ///     Sets the console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Gets credit update entries.
        /// </summary>
        Task<LiveOpsService.GetCreditUpdateEntriesOutput> GetCreditUpdateEntriesAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Gets profile summary.
        /// </summary>
        Task<LiveOpsService.GetProfileSummaryOutput> GetProfileSummaryAsync(ulong xuid);

        /// <summary>
        ///     Sets is under review flag.
        /// </summary>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview);

        /// <summary>
        ///     Gets the under review flag.
        /// </summary>
        Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid);

        /// <summary>
        ///     Gets the user group memberships.
        /// </summary>
        Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupIdFilter, int maxResults);

        /// <summary>
        ///     Adds to user groups.
        /// </summary>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Removes from user groups.
        /// </summary>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Gets user profiles using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles);

        /// <summary>
        ///     Gets user inventory using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///     Gets user inventory by profileID using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId);

        /// <summary>
        ///     Retrieves notifications for a user.
        /// </summary>
        public Task<NotificationsService.LiveOpsRetrieveForUserOutput> LiveOpsRetrieveForUserAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Sends message to multiple xuids.
        /// </summary>
        Task<NotificationsService.SendMessageNotificationToMultipleUsersOutput> SendMessageNotificationToMultipleUsersAsync(IList<ulong> xuids, string message, DateTime expireTimeUtc);

        /// <summary>
        ///     Sends group message.
        /// </summary>
        public Task SendGroupMessageNotificationAsync(int groupId, string message, DateTime expireTimeUtc);

        /// <summary>
        ///     Gets supported gift types using the admin endpoint.
        /// </summary>
        Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults);

        /// <summary>
        ///     Sends item gift using admin endpoint.
        /// </summary>
        Task AdminSendItemGiftAsync(ulong recipientXuid, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Sends gift to LSP group.
        /// </summary>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<UserManagementService.BanUsersOutput> BanUsersAsync(ForzaUserBanParameters[] banParameters, int xuidCount);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<UserManagementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Gets user ban summaries.
        /// </summary>
        Task<UserManagementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, int xuidCount);

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        Task<AuctionManagementService.SearchAuctionHouseOutput> GetPlayerAuctions(ForzaAuctionFilters filters);

        /// <summary>
        ///     Gets auction house block list.
        /// </summary>
        Task<AuctionManagementService.GetAuctionBlocklistOutput> GetAuctionBlockListAsync(int maxResults);

        /// <summary>
        ///     Adds or updates an entry in the auction house block list.
        /// </summary>
        Task AddAuctionBlocklistEntriesAsync(ForzaAuctionBlocklistEntry[] blockEntries);

        /// <summary>
        ///     Removes an entry from the auction house block list.
        /// </summary>
        Task DeleteAuctionBlocklistEntriesAsync(int[] carIds);

        /// <summary>
        ///     Gets token balance.
        /// </summary>
        Task<RareCarShopService.AdminGetTokenBalanceOutput> GetTokenBalanceAsync(ulong xuid);

        /// <summary>
        ///     Sets token balance.
        /// </summary>
        Task SetTokenBalanceAsync(ulong xuid, uint newBalance);

        /// <summary>
        ///     Gets token transactions.
        /// </summary>
        Task<RareCarShopService.AdminGetTransactionsOutput> GetTokenTransactionsAsync(ulong xuid);

        /// <summary>
        ///     Get player liveries.
        /// </summary>
        Task<StorefrontManagementService.SearchUGCLiveriesOutput> GetPlayerLiveries(ForzaUGCSearchRequest filters);

        /// <summary>
        ///     Get player photos.
        /// </summary>
        Task<StorefrontManagementService.SearchUGCPhotosOutput> GetPlayerPhotos(ForzaUGCSearchRequest filters);

        /// <summary>
        ///     Get a player livery.
        /// </summary>
        Task<StorefrontManagementService.GetUGCLiveryOutput> GetPlayerLivery(Guid liveryId);

        /// <summary>
        ///     Get a player photo.
        /// </summary>
        Task<StorefrontManagementService.GetUGCPhotoOutput> GetPlayerPhoto(Guid photoId);

        /// <summary>
        ///     Sets featured state of a UGC content item.
        /// </summary>
        Task SetUGCFeaturedStatus(Guid contentId, bool isFeatured, DateTime featureEndDate);
    }
}
