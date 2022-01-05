using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Forza.LiveOps.FH5.Generated;
using Forza.UserGeneratedContent.FH5.Generated;
using Forza.UserInventory.FH5.Generated;
using Forza.WebServices.FH5.Generated;
using Turn10.Data.Common;
using GiftingService = Forza.LiveOps.FH5.Generated.GiftingService;
using NotificationsManagementService = Forza.LiveOps.FH5.Generated.NotificationsManagementService;
using RareCarShopService = Forza.WebServices.FH5.Generated.RareCarShopService;
using UserInventoryService = Forza.LiveOps.FH5.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <inheritdoc />
    public sealed class WoodstockServiceWrapper : IWoodstockService
    {
        private readonly IWoodstockServiceFactory serviceFactory;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockServiceWrapper"/> class.
        /// </summary>
        public WoodstockServiceWrapper(
            IWoodstockServiceFactory woodstockServiceFactory)
        {
            woodstockServiceFactory.ShouldNotBeNull(nameof(woodstockServiceFactory));

            this.serviceFactory = woodstockServiceFactory;
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetUserDataByXuidAsync(
            ulong xuid,
            string endpoint)
        {
            var userLookupService = await this.serviceFactory.PrepareUserLookupServiceAsync(endpoint).ConfigureAwait(false);

            return await userLookupService.GetLiveOpsUserDataByXuid(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetUserDataByGamertagAsync(
            string gamertag,
            string endpoint)
        {
            var userLookupService = await this.serviceFactory.PrepareUserLookupServiceAsync(endpoint).ConfigureAwait(false);

            return await userLookupService.GetLiveOpsUserDataByGamerTag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetUserIdsOutput> GetUserIdsAsync(
            ForzaPlayerLookupParameters[] parameters,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetUserIds(parameters.Length, parameters).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetProfileSummaryOutput> GetProfileSummaryAsync(
            ulong xuid,
            string endpoint)
        {
            var liveOpsService = await this.serviceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await liveOpsService.GetProfileSummary(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetCreditUpdateEntriesOutput> GetCreditUpdateEntriesAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var liveOpsService = await this.serviceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await liveOpsService.GetCreditUpdateEntries(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetConsoles(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startAt,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetSharedConsoleUsers(xuid, startAt, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetAdminCommentsOutput> GetProfileNotesAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetAdminComments(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AddProfileNoteAsync(ulong xuid, string text, string author, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.AddAdminComment(xuid, text, author).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserGroups(startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(
            ulong xuid,
            int[] groupFilter,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserGroupMemberships(xuid, groupFilter, maxResults)
                .ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.RemoveFromUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AddToUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.AddToUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(
            ulong xuid,
            string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetIsUnderReview(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview, string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.SetIsUnderReview(xuid, isUnderReview).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(
            ulong[] xuids,
            string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserBanSummaries(xuids, xuids.Length).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserBanHistory(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserManagementService.BanUsersOutput> BanUsersAsync(
            ForzaUserBanParameters[] banParameters,
            int xuidCount,
            string endpoint)
        {
            var userManagementService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.BanUsers(banParameters, xuidCount).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<RareCarShopService.AdminGetTokenBalanceOutput> GetTokenBalanceAsync(
            ulong xuid,
            string endpoint)
        {
            var rareCarShopService = await this.serviceFactory.PrepareRareCarShopServiceAsync(endpoint).ConfigureAwait(false);

            return await rareCarShopService.AdminGetTokenBalance(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetTokenBalanceAsync(ulong xuid, uint newBalance, string endpoint)
        {
            var rareCarShopService = await this.serviceFactory.PrepareRareCarShopServiceAsync(endpoint).ConfigureAwait(false);

            await rareCarShopService.AdminSetBalance(xuid, newBalance).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<RareCarShopService.AdminGetTransactionsOutput> GetTokenTransactionsAsync(
            ulong xuid,
            string endpoint)
        {
            var rareCarShopService = await this.serviceFactory.PrepareRareCarShopServiceAsync(endpoint).ConfigureAwait(false);

            return await rareCarShopService.AdminGetTransactions(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(
            ulong xuid,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserInventoryServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput>
            GetAdminUserInventoryByProfileIdAsync(int profileId, string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserInventoryServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserProfilesOutput>
            GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles, string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserInventoryServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<GiftingService.AdminGetSupportedGiftTypesOutput>
            AdminGetSupportedGiftTypesAsync(int maxResults, string endpoint)
        {
            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            return await giftingService.AdminGetSupportedGiftTypes(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AdminSendItemGiftAsync(
            ulong xuid,
            InventoryItemType itemType,
            int itemValue,
            string endpoint)
        {
            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            await giftingService.AdminSendItemGift(xuid, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AdminSendItemGroupGiftAsync(
            int groupId,
            InventoryItemType itemType,
            int itemValue,
            string endpoint)
        {
            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            await giftingService.AdminSendItemGroupGift(groupId, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GiftingService.AdminSendLiveryGiftOutput> SendCarLiveryAsync(ulong[] xuids, Guid liveryId, string endpoint)
        {
            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            return await giftingService.AdminSendLiveryGift(xuids, xuids.Length, liveryId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GiftingService.AdminSendGroupLiveryGiftOutput> SendCarLiveryAsync(int groupId, Guid liveryId, string endpoint)
        {
            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            return await giftingService.AdminSendGroupLiveryGift(groupId, liveryId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.LiveOpsRetrieveForUserExOutput>
            LiveOpsRetrieveForUserAsync(ulong xuid, int maxResults, string endpoint)
        {
            var notificationsService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint)
                .ConfigureAwait(false);

            return await notificationsService.LiveOpsRetrieveForUserEx(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.GetAllUserGroupMessagesOutput> GetUserGroupNotificationsAsync(
            int groupId,
            int maxResults,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.GetAllUserGroupMessages(groupId, maxResults)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.GetNotificationOutput> GetPlayerNotificationAsync(
            ulong xuid,
            Guid notificationId,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.GetNotification(xuid, notificationId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.GetUserGroupMessageOutput> GetUserGroupNotificationAsync(
            Guid notificationId,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.GetUserGroupMessage(notificationId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.SendMessageNotificationToMultipleUsersOutput>
            SendMessageNotificationToMultipleUsersAsync(
            IList<ulong> xuids,
            string message,
            DateTime expireTimeUtc,
            string endpoint)
        {
            var notificationsService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint)
                .ConfigureAwait(false);

            return await notificationsService.SendMessageNotificationToMultipleUsers(
                xuids.ToArray(),
                xuids.Count,
                message,
                expireTimeUtc).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.SendGroupMessageNotificationOutput> SendGroupMessageNotificationAsync(
            int groupId,
            string message,
            DateTime expireTimeUtc,
            ForzaLiveDeviceType deviceType,
            string endpoint)
        {
            var notificationsService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint)
                .ConfigureAwait(false);

            return await notificationsService.SendGroupMessageNotification(groupId, message, expireTimeUtc, deviceType != ForzaLiveDeviceType.Invalid, deviceType)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task EditNotificationAsync(
            Guid notificationId,
            ulong xuid,
            ForzaCommunityMessageNotificationEditParameters messageParams,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            await notificationsManagementService.EditNotification(notificationId, xuid, messageParams)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task EditGroupNotificationAsync(
            Guid notificationId,
            ForzaCommunityMessageNotificationEditParameters messageParams,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            await notificationsManagementService.EditGroupNotification(notificationId, messageParams)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<AuctionManagementService.SearchAuctionHouseOutput> GetPlayerAuctionsAsync(
            ForzaAuctionFilters filters,
            string endpoint)
        {
            var auctionService = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await auctionService.SearchAuctionHouse(filters).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<Forza.LiveOps.FH5.Generated.ForzaAuction> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint)
        {
            var auctionService = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);
            var result = await auctionService.GetAuctionData(auctionId).ConfigureAwait(false);
            return result?.auction;
        }

        /// <inheritdoc/>
        public async Task<AuctionManagementService.GetAuctionBlocklistOutput> GetAuctionBlockListAsync(int maxResults, string endpoint)
        {
            var auctionService = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await auctionService.GetAuctionBlocklist(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AddAuctionBlocklistEntriesAsync(ForzaAuctionBlocklistEntry[] blockEntries, string endpoint)
        {
            var auctionService = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            await auctionService.AddToAuctionBlocklist(blockEntries).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task DeleteAuctionBlocklistEntriesAsync(int[] carIds, string endpoint)
        {
            var auctionService = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            await auctionService.DeleteAuctionBlocklistEntries(carIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontManagementService.SearchUGCOutput> SearchUgcContentAsync(
            ForzaUGCSearchRequest filters,
            ForzaUGCContentType contentType,
            string endpoint)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontService.SearchUGC(filters, contentType, false, 1_000).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontManagementService.GetUGCLiveryOutput> GetPlayerLiveryAsync(
            Guid liveryId,
            string endpoint)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontService.GetUGCLivery(liveryId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontManagementService.GetUGCPhotoOutput> GetPlayerPhotoAsync(
            Guid photoId,
            string endpoint)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontService.GetUGCPhoto(photoId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontManagementService.GetUGCTuneOutput> GetPlayerTuneAsync(
            Guid tuneId,
            string endpoint)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontService.GetUGCTune(tuneId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontService.GetHiddenUGCForUserOutput> GetHiddenUgcForUserAsync(
            int maxUgcCount,
            ulong xuid,
            FileType fileType,
            string endpoint)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontService.GetHiddenUGCForUser(maxUgcCount, xuid, fileType).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetUGCFeaturedStatusAsync(
            Guid contentId,
            bool isFeatured,
            DateTime featureEndDate,
            string endpoint)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            // NOTE: User scenario for setting featured state always uses the same DateTime for featureEndDate & forceFeatureEndDate
            await storefrontService.SetFeatured(contentId, isFeatured, featureEndDate, featureEndDate).ConfigureAwait(false);
        }
    }
}
