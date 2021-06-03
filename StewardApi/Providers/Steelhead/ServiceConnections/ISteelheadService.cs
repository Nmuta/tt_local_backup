using System.Threading.Tasks;
using Forza.LiveOps.Steelhead_master.Generated;
using Forza.UserInventory.Steelhead_master.Generated;
using Forza.WebServices.Steelhead_master.Generated;
using GiftingService = Forza.LiveOps.Steelhead_master.Generated.GiftingService;
using UserInventoryService = Forza.LiveOps.Steelhead_master.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <summary>
    ///      Exposes methods for interacting with the Steelhead User Service.
    /// </summary>
    public interface ISteelheadService
    {
        /// <summary>
        ///     Get user data by xuid.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetUserDataByXuidAsync(ulong xuid);

        /// <summary>
        ///     Get user data by gamertag.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetUserDataByGamertagAsync(string gamertag);

        /// <summary>
        ///     Get consoles.
        /// </summary>
        Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Set console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Get shared console users.
        /// </summary>
        Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startAt, int maxResults);

        /// <summary>
        ///     Get LSP groups.
        /// </summary>
        Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Get user group memberships.
        /// </summary>
        Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupFilter, int maxResults);

        /// <summary>
        ///     Remove user from groups.
        /// </summary>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Add user to groups.
        /// </summary>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Get is under review.
        /// </summary>
        Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid);

        /// <summary>
        ///     Set is under review.
        /// </summary>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview);

        /// <summary>
        ///     Get user ban summaries.
        /// </summary>
        Task<UserManagementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids);

        /// <summary>
        ///     Get user ban history.
        /// </summary>
        Task<UserManagementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Ban users.
        /// </summary>
        Task<UserManagementService.BanUsersOutput> BanUsersAsync(ForzaUserBanParameters[] banParameters, int xuidCount);

        /// <summary>
        ///     Get user inventory.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get user inventory by profile ID.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId);

        /// <summary>
        ///     Get user inventory profiles.
        /// </summary>
        Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles);

        /// <summary>
        ///     Gets supported gift types using the admin endpoint.
        /// </summary>
        Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults);

        /// <summary>
        ///     Send an item gift.
        /// </summary>
        Task AdminSendItemGiftAsync(ulong xuid, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Send a group item gift.
        /// </summary>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue);
    }
}
