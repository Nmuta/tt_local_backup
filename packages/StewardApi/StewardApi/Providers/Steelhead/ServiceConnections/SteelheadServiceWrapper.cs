using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
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
    /// <inheritdoc />
    public sealed class SteelheadServiceWrapper : ISteelheadService
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.StewardEnvironment
        };

        private readonly bool allowGiftingToAllUsers;
        private readonly ISteelheadServiceFactory serviceFactory;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadServiceWrapper"/> class.
        /// </summary>
        public SteelheadServiceWrapper(IConfiguration configuration, ISteelheadServiceFactory steelheadServiceFactory)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);
            steelheadServiceFactory.ShouldNotBeNull(nameof(steelheadServiceFactory));

            this.allowGiftingToAllUsers = configuration[ConfigurationKeyConstants.StewardEnvironment] == "prod";
            this.serviceFactory = steelheadServiceFactory;
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetUserDataByXuidAsync(
            ulong xuid,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetLiveOpsUserDataByXuid(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetUserDataByGamertagAsync(
            string gamertag,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetLiveOpsUserDataByGamerTag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<AuctionManagementService.SearchAuctionHouseOutput> SearchAuctionsAsync(
            ForzaAuctionFilters filters,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.SearchAuctionHouse(filters).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AddToAuctionBlocklistAsync(
            ForzaAuctionBlocklistEntry[] carsToBlock,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.AddToAuctionBlocklist(carsToBlock).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<AuctionManagementService.GetAuctionBlocklistOutput> GetAuctionBlocklistAsync(
            int maxResult,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetAuctionBlocklist(maxResult).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task DeleteAuctionBlocklistEntriesAsync(
            int[] carIds,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.DeleteAuctionBlocklistEntries(carIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<AuctionManagementService.GetAuctionDataOutput> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetAuctionData(auctionId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<AuctionManagementService.DeleteAuctionsOutput> DeleteAuctionsAsync(
            Guid[] auctionIds,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.DeleteAuctions(auctionIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<GiftingManagementService.AdminSendLiveryGiftOutput> SendLiveryGiftAsync(
            ulong[] recipientXuids,
            int xuidCount,
            Guid liveryId,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareGiftingManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.AdminSendLiveryGift(recipientXuids, xuidCount, liveryId, false, 0).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<GiftingManagementService.AdminSendGroupLiveryGiftOutput> SendGroupLiveryGiftAsync(
            int groupId,
            Guid liveryId,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareGiftingManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.AdminSendGroupLiveryGift(groupId, liveryId, false, 0).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SendItemGiftV2Async(
            ulong recipientXuid,
            string itemType,
            int itemValue,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareGiftingManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.AdminSendItemGiftV2(recipientXuid, itemType, itemValue, false, 0).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SendItemGroupGiftV2Async(
            int groupId,
            string itemType,
            int itemValue,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareGiftingManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.AdminSendItemGroupGiftV2(groupId, itemType, itemValue, false, 0).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<GiftingManagementService.AdminGetSupportedGiftTypesV2Output> GetSupportedGiftTypesV2Async(
            int maxResults,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareGiftingManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.AdminGetSupportedGiftTypesV2(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LocalizationManagementService.AddStringToLocalizeOutput> AddStringToLocalizeAsync(
            ForzaLocalizedStringData localizedStringData,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareLocalizationManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.AddStringToLocalize(localizedStringData).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<NotificationManagementService.LiveOpsRetrieveForUserOutput> GetNotificationsForUserAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareNotificationManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.LiveOpsRetrieveForUser(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<NotificationManagementService.SendMessageNotificationToMultipleUsersOutput> SendMessageNotificationToMultipleUsersAsync(
            IList<ulong> recipients,
            string message,
            DateTime expirationTime,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareNotificationManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.SendMessageNotificationToMultipleUsers(recipients.ToArray(), recipients.Count, message, expirationTime, null, DateTime.UtcNow).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<NotificationManagementService.SendGroupMessageNotificationOutput> SendGroupMessageNotificationAsync(
            int groupId,
            string message,
            DateTime expirationTime,
            bool hasDeviceType,
            ForzaLiveDeviceType deviceType,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareNotificationManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.SendGroupMessageNotification(groupId, message, expirationTime, hasDeviceType, deviceType, DateTime.UtcNow).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<NotificationManagementService.SendNotificationByDeviceTypeOutput> SendNotificationByDeviceTypeAsync(
            ForzaLiveDeviceType deviceType,
            string message,
            DateTime expirationTime,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareNotificationManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.SendNotificationByDeviceType(deviceType, message, expirationTime, DateTime.UtcNow).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task EditNotificationAsync(
            Guid notificationId,
            ulong xuid,
            ForzaCommunityMessageNotificationEditParameters editParameters,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareNotificationManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.EditNotification(notificationId, xuid, editParameters).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task EditGroupNotificationAsync(
            Guid notificationId,
            ForzaCommunityMessageNotificationEditParameters editParameters,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareNotificationManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.EditGroupNotification(notificationId, editParameters).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<NotificationManagementService.GetAllUserGroupMessagesOutput> GetAllUserGroupMessagesAsync(
            int groupId,
            int maxResults,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareNotificationManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetAllUserGroupMessages(groupId, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<NotificationManagementService.GetUserGroupMessageOutput> GetUserGroupMessageAsync(
            Guid notificationId,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareNotificationManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetUserGroupMessage(notificationId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<NotificationManagementService.GetNotificationOutput> GetNotificationAsync(
            ulong xuid,
            Guid notificationId,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareNotificationManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetNotification(xuid, notificationId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<NotificationManagementService.DeleteNotificationsForUserOutput> DeleteNotificationsForUserAsync(
            ulong xuid,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareNotificationManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.DeleteNotificationsForUser(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<StorefrontManagementService.SearchUGCOutput> SearchUGCAsync(
            ForzaUGCSearchRequest searchRequest,
            ForzaUGCContentType contentType,
            bool includeThumbnails,
            int maxResults,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.SearchUGC(searchRequest, contentType, includeThumbnails, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<StorefrontManagementService.GetUGCLiveryOutput> GetUGCLiveryAsync(
            Guid id,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetUGCLivery(id).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<StorefrontManagementService.GetUGCPhotoOutput> GetUGCPhotoAsync(
            Guid id,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetUGCPhoto(id).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<StorefrontManagementService.GetUGCTuneOutput> GetUGCTuneAsync(
            Guid id,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetUGCTune(id).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetFeaturedAsync(
            Guid id,
            bool featured,
            DateTime featureEndDate,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.SetFeatured(id, featured, featureEndDate, featureEndDate).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryManagementService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(
            ulong xuid,
            uint maxProfiles,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserInventoryManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.BanUsersOutput> BanUsersAsync(
            ForzaUserBanParameters[] banParameters,
            int xuidCount,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.BanUsers(banParameters, xuidCount).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetUserBanHistory(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(
            ulong[] xuids,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetUserBanSummaries(xuids, xuids.Length).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.ExpireBanEntriesOutput> ExpireBanEntriesAsync(
            ForzaUserExpireBanParameters[] parameters,
            int entryCount,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.ExpireBanEntries(parameters, entryCount).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.DeleteBanEntriesOutput> DeleteBanEntriesAsync(
            int[] banEntryIds,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.DeleteBanEntries(banEntryIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetUserGroups(startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(
            ulong xuid,
            int[] groupIdFilter,
            int maxResults,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetUserGroupMemberships(xuid, groupIdFilter, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AddToUserGroupsAsync(
            ulong xuid,
            int[] groupIds,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.AddToUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task RemoveFromUserGroupsAsync(
            ulong xuid,
            int[] groupIds,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.RemoveFromUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(
            ulong xuid,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetIsUnderReview(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetIsUnderReviewAsync(
            ulong xuid,
            bool isUnderReview,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.SetIsUnderReview(xuid, isUnderReview).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetConsoles(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetConsoleBanStatusAsync(
            ulong consoleId,
            bool isBanned,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startAt,
            int maxResults,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetSharedConsoleUsers(xuid, startAt, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetAdminCommentsOutput> GetAdminCommentsAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetAdminComments(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AddAdminCommentAsync(
            ulong xuid,
            string text,
            string author,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.AddAdminComment(xuid, text, author).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserIdsOutput> LookupPlayersAsync(
            ForzaPlayerLookupParameters[] playerLookupParameters,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetUserIds(playerLookupParameters.Length, playerLookupParameters).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserReportWeightOutput> GetUserReportWeightAsync(
            ulong xuid,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetUserReportWeight(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetUserReportWeightAsync(
            ulong xuid,
            int reportWeight,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.SetUserReportWeight(xuid, reportWeight).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetHasPlayedRecordOutput> GetHasPlayedRecordAsync(
            ulong xuid,
            Guid externalProfileId,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await service.GetHasPlayedRecord(xuid, externalProfileId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetHasPlayedRecordAsync(
            ulong xuid,
            int title,
            bool hasPlayed,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.SetHasPlayedRecord(xuid, title, hasPlayed).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task ResendProfileHasPlayedNotificationAsync(
            ulong xuid,
            Guid externalProfileId,
            int[] titles,
            string endpoint)
        {
            var service = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await service.ResendProfileHasPlayedNotification(xuid, externalProfileId, titles).ConfigureAwait(false);
        }
    }
}
