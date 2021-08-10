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
        Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetUserDataByXuidAsync(ulong xuid);

        /// <summary>
        ///     Gets user data by gamertag.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetUserDataByGamertagAsync(string gamertag);

        /// <summary>
        ///     Gets credit update entries.
        /// </summary>
        Task<LiveOpsService.GetCreditUpdateEntriesOutput> GetCreditUpdateEntriesAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Gets profile summary.
        /// </summary>
        Task<LiveOpsService.GetProfileSummaryOutput> GetProfileSummaryAsync(ulong xuid);

        /// <summary>
        ///     Gets user IDs.
        /// </summary>
        Task<UserManagementService.GetUserIdsOutput> GetUserIds(ForzaPlayerLookupParameters[] parameters);

        /// <summary>
        ///     Gets consoles.
        /// </summary>
        Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Sets console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startAt, int maxResults);

        /// <summary>
        ///     Gets LSP groups.
        /// </summary>
        Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Gets user group memberships.
        /// </summary>
        Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupFilter, int maxResults);

        /// <summary>
        ///     Removes user from groups.
        /// </summary>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Adds user to groups.
        /// </summary>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Gets is under review.
        /// </summary>
        Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid);

        /// <summary>
        ///     Sets is under review.
        /// </summary>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview);

        /// <summary>
        ///     Gets user ban summaries.
        /// </summary>
        Task<UserManagementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<UserManagementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<UserManagementService.BanUsersOutput> BanUsersAsync(ForzaUserBanParameters[] banParameters, int xuidCount);

        /// <summary>
        ///     Gets user inventory.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///     Gets user inventory by profile ID.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId);

        /// <summary>
        ///     Gets user inventory profiles.
        /// </summary>
        Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles);

        /// <summary>
        ///     Gets supported gift types.
        /// </summary>
        Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypes(int maxResults);

        /// <summary>
        ///     Sends an item gift.
        /// </summary>
        Task AdminSendItemGiftAsync(ulong xuid, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Sends a group item gift.
        /// </summary>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Gets token balance.
        /// </summary>
        Task<RareCarShopService.AdminGetTokenBalanceOutput> GetTokenBalanceAsync(ulong xuid);

        /// <summary>
        ///     Sets token balance.
        /// </summary>
        Task SetTokenBalanceAsync(ulong xuid, uint newBalance);

        /// <summary>
        ///     Gets transactions.
        /// </summary>
        Task<RareCarShopService.AdminGetTransactionsOutput> GetTokenTransactionsAsync(ulong xuid);

        /// <summary>
        ///     Retrieves notifications for a user.
        /// </summary>
        public Task<NotificationsManagementService.LiveOpsRetrieveForUserOutput> LiveOpsRetrieveForUserAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Sends message to multiple xuids.
        /// </summary>
        Task<NotificationsManagementService.SendMessageNotificationToMultipleUsersOutput> SendMessageNotificationToMultipleUsersAsync(IList<ulong> xuids, string message, DateTime expireTimeUtc);

        /// <summary>
        ///     Sends group message.
        /// </summary>
        public Task SendGroupMessageNotificationAsync(int groupId, string message, DateTime expireTimeUtc);

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        Task<AuctionManagementService.SearchAuctionHouseOutput> GetPlayerAuctions(ForzaAuctionFilters filters);

        /// <summary>
        ///     Gets auction house block list.
        /// </summary>
        Task<AuctionManagementService.GetAuctionBlocklistOutput> GetAuctionBlockList(int maxResults);

        /// <summary>
        ///     Adds or updates an entry in the auction house block list.
        /// </summary>
        Task AddAuctionBlocklistEntriesAsync(ForzaAuctionBlocklistEntry[] blockEntries);

        /// <summary>
        ///     Removes an entry from the auction house block list.
        /// </summary>
        Task DeleteAuctionBlocklistEntries(int[] carIds);
    }
}
