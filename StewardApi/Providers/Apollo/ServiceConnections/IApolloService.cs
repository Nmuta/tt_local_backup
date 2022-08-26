using System.Threading.Tasks;
using Forza.UserInventory.FM7.Generated;
using Forza.WebServices.FM7.Generated;

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
        Task<UserService.LiveOpsGetUserDataByGamertagOutput> LiveOpsGetUserDataByGamertagAsync(
            string gamertag,
            string endpoint);

        /// <summary>
        ///     Gets user data by xuid.
        /// </summary>
        Task<UserService.LiveOpsGetUserDataByXuidOutput> LiveOpsGetUserDataByXuidAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<UserService.BanUsersV2Output> BanUsersAsync(
            ForzaUserBanParametersV2[] banParameters,
            int xuidCount,
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
        Task<UserService.GetUserBanHistoryV2Output> GetUserBanHistoryAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets user ban summaries.
        /// </summary>
        Task<UserService.GetUserBanSummariesV2Output> GetUserBanSummariesAsync(
            ulong[] xuids,
            string endpoint);

        /// <summary>
        ///     Gets consoles.
        /// </summary>
        Task<UserService.GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults, string endpoint);

        /// <summary>
        ///     Sets console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        Task<UserService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets the under review flag.
        /// </summary>
        Task<UserService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Sets is under review flag.
        /// </summary>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview, string endpoint);

        /// <summary>
        ///     Gets user inventory using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Gets user inventory by profile ID using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(
            int profileId,
            string endpoint);

        /// <summary>
        ///     Gets user profiles using admin endpoint.
        /// </summary>
        Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(
            ulong xuid,
            uint maxProfiles,
            string endpoint);

        /// <summary>
        ///     Adds user to groups.
        /// </summary>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint);

        /// <summary>
        ///     Gets user group membership.
        /// </summary>
        Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(
            ulong xuid,
            int[] groupIdFilter,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets user groups.
        /// </summary>
        Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Removes from user groups.
        /// </summary>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint);

        /// <summary>
        ///     Gets supported gift types.
        /// </summary>
        Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Sends item gift.
        /// </summary>
        Task AdminSendItemGiftAsync(
            ulong recipientXuid,
            InventoryItemType itemType,
            int itemValue,
            string endpoint);

        /// <summary>
        ///     Sends item group gifts.
        /// </summary>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue, string endpoint);

        /// <summary>
        ///    Sends car livery to a player xuid.
        /// </summary>
        Task<GiftingService.AdminSendLiveryGiftOutput> SendCarLiveryAsync(ulong[] xuids, string liveryId, string endpoint);

        /// <summary>
        ///    Sends car livery to a user group.
        /// </summary>
        Task<GiftingService.AdminSendGroupLiveryGiftOutput> SendCarLiveryAsync(int groupId, string liveryId, string endpoint);

        /// <summary>
        ///     Gets a player's public and private UGC content.
        /// </summary>
        Task<StorefrontManagementService.GetUGCForUserOutput> GetPlayerUgcContentAsync(
            ulong xuid,
            ForzaUGCContentType contentType,
            string endpoint,
            bool includeThumbnails = false);

        /// <summary>
        ///     Search player UGC content.
        /// </summary>
        Task<StorefrontManagementService.SearchUGCV2Output> SearchUgcContentAsync(
            ForzaUGCSearchV2Request filters,
            ForzaUGCContentType contentType,
            string endpoint,
            bool includeThumbnails = false);

        /// <summary>
        ///     Get a player livery.
        /// </summary>
        Task<StorefrontManagementService.GetUGCLiveryOutput> GetPlayerLiveryAsync(
            string liveryId,
            string endpoint);
    }
}
