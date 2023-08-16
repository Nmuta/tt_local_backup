using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FM8.Generated;
using AuctionManagementService = Turn10.Services.LiveOps.FM8.Generated.AuctionManagementService;
using GiftingManagementService = Turn10.Services.LiveOps.FM8.Generated.GiftingManagementService;
using LiveOpsService = Forza.WebServices.FM8.Generated.LiveOpsService;
using LocalizationManagementService = Turn10.Services.LiveOps.FM8.Generated.LocalizationManagementService;
using NotificationManagementService = Turn10.Services.LiveOps.FM8.Generated.NotificationsManagementService;
using StorefrontManagementService = Turn10.Services.LiveOps.FM8.Generated.StorefrontManagementService;
using UserInventoryManagementService = Turn10.Services.LiveOps.FM8.Generated.UserInventoryManagementService;
using UserManagementService = Turn10.Services.LiveOps.FM8.Generated.UserManagementService;

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
        Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetUserDataByXuidAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Gets user data by gamertag.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetUserDataByGamertagAsync(
            string gamertag,
            string endpoint);

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        Task<AuctionManagementService.SearchAuctionHouseOutput> SearchAuctionsAsync(
            ForzaAuctionFilters filters,
            string endpoint);

        /// <summary>
        ///     Add cars to auction blocklist.
        /// </summary>
        Task AddToAuctionBlocklistAsync(
            ForzaAuctionBlocklistEntry[] carsToBlock,
            string endpoint);

        /// <summary>
        ///     Gets the auction blocklist.
        /// </summary>
        Task<AuctionManagementService.GetAuctionBlocklistOutput> GetAuctionBlocklistAsync(
            int maxResult,
            string endpoint);

        /// <summary>
        ///     Delete auction blocklist entries.
        /// </summary>
        Task DeleteAuctionBlocklistEntriesAsync(
            int[] carIds,
            string endpoint);

        /// <summary>
        ///     Gets data from single auction.
        /// </summary>
        Task<AuctionManagementService.GetAuctionDataOutput> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint);

        /// <summary>
        ///     Deletes auctions based on their IDs.
        /// </summary>
        Task<AuctionManagementService.DeleteAuctionsOutput> DeleteAuctionsAsync(
            Guid[] auctionIds,
            string endpoint);

        /// <summary>
        ///     Sends car livery to a player.
        /// </summary>
        Task<GiftingManagementService.AdminSendLiveryGiftOutput> SendLiveryGiftAsync(
            ulong[] recipientXuids,
            int xuidCount,
            Guid liveryId,
            string endpoint);

        /// <summary>
        ///     Sends car livery to an LSP user group.
        /// </summary>
        Task<GiftingManagementService.AdminSendGroupLiveryGiftOutput> SendGroupLiveryGiftAsync(
            int groupId,
            Guid liveryId,
            string endpoint);

        /// <summary>
        ///     Sends a quantity of an item to a player.
        /// </summary>
        Task SendItemGiftV2Async(
            ulong recipientXuid,
            string itemType,
            int itemValue,
            string endpoint);

        /// <summary>
        ///     Sends a quantity of an item to an LSP user group.
        /// </summary>
        Task SendItemGroupGiftV2Async(
            int groupId,
            string itemType,
            int itemValue,
            string endpoint);

        /// <summary>
        ///     Gets all supported gift types.
        /// </summary>
        Task<GiftingManagementService.AdminGetSupportedGiftTypesV2Output> GetSupportedGiftTypesV2Async(
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Adds string to be localized in Pegasus pipeline.
        /// </summary>
        Task<LocalizationManagementService.AddStringToLocalizeOutput> AddStringToLocalizeAsync(
            ForzaLocalizedStringData localizedStringData,
            string endpoint);

        /// <summary>
        ///     Gets all messages from a player.
        /// </summary>
        Task<NotificationManagementService.LiveOpsRetrieveForUserOutput> GetNotificationsForUserAsync(
            ulong xuid,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Sends message to multiple players.
        /// </summary>
        Task<NotificationManagementService.SendMessageNotificationToMultipleUsersOutput> SendMessageNotificationToMultipleUsersAsync(
            IList<ulong> recipients,
            string message,
            DateTime expirationTime,
            string endpoint);

        /// <summary>
        ///     Sends message to a LSP user group.
        /// </summary>
        Task<NotificationManagementService.SendGroupMessageNotificationOutput> SendGroupMessageNotificationAsync(
            int groupId,
            string message,
            DateTime expirationTime,
            bool hasDeviceType,
            ForzaLiveDeviceType deviceType,
            string endpoint);

        /// <summary>
        ///     Sends message to a specific device type.
        /// </summary>
        Task<NotificationManagementService.SendNotificationByDeviceTypeOutput> SendNotificationByDeviceTypeAsync(
            ForzaLiveDeviceType deviceType,
            string message,
            DateTime expirationTime,
            string endpoint);

        /// <summary>
        ///     Edits a player message.
        /// </summary>
        Task EditNotificationAsync(
            Guid notificationId,
            ulong xuid,
            ForzaCommunityMessageNotificationEditParameters editParameters,
            string endpoint);

        /// <summary>
        ///     Edits message from an LSP user group.
        /// </summary>
        Task EditGroupNotificationAsync(
            Guid notificationId,
            ForzaCommunityMessageNotificationEditParameters editParameters,
            string endpoint);

        /// <summary>
        ///     Gets all messages from an LSP user group.
        /// </summary>
        Task<NotificationManagementService.GetAllUserGroupMessagesOutput> GetAllUserGroupMessagesAsync(
            int groupId,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets a message.
        /// </summary>
        Task<NotificationManagementService.GetUserGroupMessageOutput> GetUserGroupMessageAsync(
            Guid notificationId,
            string endpoint);

        /// <summary>
        ///     Gets message from a player.
        /// </summary>
        Task<NotificationManagementService.GetNotificationOutput> GetNotificationAsync(
            ulong xuid,
            Guid notificationId,
            string endpoint);

        /// <summary>
        ///     Deletes all messages from a player.
        /// </summary>
        /// <remarks>To be used for E2E testing only.</remarks>
        Task<NotificationManagementService.DeleteNotificationsForUserOutput> DeleteNotificationsForUserAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Searchs public UGC.
        /// </summary>
        Task<StorefrontManagementService.SearchUGCOutput> SearchUGCAsync(
            ForzaUGCSearchRequest searchRequest,
            ForzaUGCContentType contentType,
            bool includeThumbnails,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets livery.
        /// </summary>
        Task<StorefrontManagementService.GetUGCLiveryOutput> GetUGCLiveryAsync(
            Guid id,
            string endpoint);

        /// <summary>
        ///     Gets photo.
        /// </summary>
        Task<StorefrontManagementService.GetUGCPhotoOutput> GetUGCPhotoAsync(
            Guid id,
            string endpoint);

        /// <summary>
        ///     Gets tune.
        /// </summary>
        Task<StorefrontManagementService.GetUGCTuneOutput> GetUGCTuneAsync(
            Guid id,
            string endpoint);

        /// <summary>
        ///     Sets featured status of UGC item.
        /// </summary>
        Task SetFeaturedAsync(
            Guid id,
            bool featured,
            DateTime featureEndDate,
            string endpoint);

        /// <summary>
        ///     Gets inventory profiles for a player.
        /// </summary>
        Task<UserInventoryManagementService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(
            ulong xuid,
            uint maxProfiles,
            string endpoint);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<UserManagementService.BanUsersOutput> BanUsersAsync(
            ForzaUserBanParameters[] banParameters,
            int xuidCount,
            string endpoint);

        /// <summary>
        ///     Gets ban history from a player.
        /// </summary>
        Task<UserManagementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets ban history summaries from a player.
        /// </summary>
        Task<UserManagementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(
            ulong[] xuids,
            string endpoint);

        /// <summary>
        ///     Expires ban entires.
        /// </summary>
        Task<UserManagementService.ExpireBanEntriesOutput> ExpireBanEntriesAsync(
            ForzaUserExpireBanParameters[] parameters,
            int entryCount,
            string endpoint);

        /// <summary>
        ///     Deletes ban entires.
        /// </summary>
        Task<UserManagementService.DeleteBanEntriesOutput> DeleteBanEntriesAsync(
            int[] banEntryIds,
            string endpoint);

        /// <summary>
        ///     Gets all LSP user groups.
        /// </summary>
        Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets player group memberships from a player.
        /// </summary>
        Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(
            ulong xuid,
            int[] groupIdFilter,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Adds player to specified user groups.
        /// </summary>
        Task AddToUserGroupsAsync(
            ulong xuid,
            int[] groupIds,
            string endpoint);

        /// <summary>
        ///     Removes uplayerser from specified user groups.
        /// </summary>
        Task RemoveFromUserGroupsAsync(
            ulong xuid,
            int[] groupIds,
            string endpoint);

        /// <summary>
        ///     Gets "is under review" status of a player.
        /// </summary>
        Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Sets "is under review" status of a player.
        /// </summary>
        Task SetIsUnderReviewAsync(
            ulong xuid,
            bool isUnderReview,
            string endpoint);

        /// <summary>
        ///     Gets consoles associated to a player.
        /// </summary>
        Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(
            ulong xuid,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Sets console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(
            ulong consoleId,
            bool isBanned,
            string endpoint);

        /// <summary>
        ///     Gets associated players from a player's consoles.
        /// </summary>
        Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startAt,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets meta-level comments on a player.
        /// </summary>
        Task<UserManagementService.GetAdminCommentsOutput> GetAdminCommentsAsync(
            ulong xuid,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Add meta-level comment to a player.
        /// </summary>
        Task AddAdminCommentAsync(
            ulong xuid,
            string text,
            string author,
            string endpoint);

        /// <summary>
        ///     Looks up players to verify they exist.
        /// </summary>
        Task<UserManagementService.GetUserIdsOutput> LookupPlayersAsync(
            ForzaPlayerLookupParameters[] playerLookupParameters,
            string endpoint);

        /// <summary>
        ///     Gets report weight of a player.
        /// </summary>
        Task<UserManagementService.GetUserReportWeightOutput> GetUserReportWeightAsync(
            ulong xuid,
            string endpoint);

        /// <summary>
        ///     Sets report weight of a player.
        /// </summary>
        Task SetUserReportWeightAsync(
            ulong xuid,
            int reportWeight,
            string endpoint);

        /// <summary>
        ///     Gets has played record of a player.
        /// </summary>
        Task<UserManagementService.GetHasPlayedRecordOutput> GetHasPlayedRecordAsync(
            ulong xuid,
            Guid externalProfileId,
            string endpoint);

        /// <summary>
        ///     Sets has played record of a player.
        /// </summary>
        Task SetHasPlayedRecordAsync(
            ulong xuid,
            int title,
            bool hasPlayed,
            string endpoint);

        /// <summary>
        ///     Resends has played rewards to a player.
        /// </summary>
        Task ResendProfileHasPlayedNotificationAsync(
            ulong xuid,
            Guid externalProfileId,
            int[] titles,
            string endpoint);
    }
}
