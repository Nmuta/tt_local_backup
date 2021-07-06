﻿using System.Threading.Tasks;
using Forza.UserInventory.FM7.Generated;
using Forza.WebServices.FM7.Generated;
using GroupingService = Xls.WebServices.FM7.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections
{
    /// <summary>
    ///     Exposes methods for interacting with the Apollo User Service.
    /// </summary>
    public interface IApolloService
    {
        /// <summary>
        ///     Gets user data by gamertag.
        /// </summary>
        Task<UserService.LiveOpsGetUserDataByGamertagOutput> LiveOpsGetUserDataByGamertagAsync(string gamertag);

        /// <summary>
        ///     Gets user data by xuid.
        /// </summary>
        Task<UserService.LiveOpsGetUserDataByXuidOutput> LiveOpsGetUserDataByXuidAsync(ulong xuid);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<UserService.BanUsersOutput> BanUsersAsync(ForzaUserBanParameters[] banParameters);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<UserService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Gets user ban summaries.
        /// </summary>
        Task<UserService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, int xuidCount);

        /// <summary>
        ///     Gets consoles.
        /// </summary>
        Task<UserService.GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Sets console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        Task<UserService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Gets the under review flag.
        /// </summary>
        Task<UserService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid);

        /// <summary>
        ///     Sets is under review flag.
        /// </summary>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview);

        /// <summary>
        ///     Gets user inventory using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///     Gets user inventory by profile ID using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId);

        /// <summary>
        ///     Gets user profiles using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles);

        /// <summary>
        ///     Adds user to groups.
        /// </summary>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Gets user group membership.
        /// </summary>
        Task<GroupingService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupIdFilter, int maxResults);

        /// <summary>
        ///     Gets user groups.
        /// </summary>
        Task<GroupingService.GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Removes from user groups.
        /// </summary>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Gets supported gift types.
        /// </summary>
        Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults);

        /// <summary>
        ///     Sends item gift.
        /// </summary>
        Task AdminSendItemGiftAsync(ulong recipientXuid, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Sends item group gifts.
        /// </summary>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue);
    }
}
