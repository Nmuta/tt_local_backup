using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Forza.LiveOps.FH4.Generated;
using Forza.UserGeneratedContent.FH4.Generated;
using Forza.UserInventory.FH4.Generated;
using Forza.WebServices.FH4.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using static Forza.WebServices.FH4.Generated.UserService;
using ForzaUserBanParameters = Forza.WebServices.FH4.Generated.ForzaUserBanParameters;
using GiftingService = Forza.LiveOps.FH4.Generated.GiftingService;
using RareCarShopService = Forza.WebServices.FH4.Generated.RareCarShopService;
using UserInventoryService = Forza.LiveOps.FH4.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections
{
    /// <inheritdoc />
    public sealed class SunriseServiceWrapper : ISunriseService
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.StewardEnvironment,
        };

        private readonly bool allowGiftingToAllUsers;
        private readonly ISunriseServiceFactory serviceFactory;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseServiceWrapper"/> class.
        /// </summary>
        public SunriseServiceWrapper(IConfiguration configuration, ISunriseServiceFactory sunriseServiceFactory)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);
            sunriseServiceFactory.ShouldNotBeNull(nameof(sunriseServiceFactory));

            this.allowGiftingToAllUsers = configuration[ConfigurationKeyConstants.StewardEnvironment] == "prod";
            this.serviceFactory = sunriseServiceFactory;
        }

        /// <inheritdoc/>
        public async Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetLiveOpsUserDataByGamerTagAsync(
            string gamertag,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetLiveOpsUserDataByGamerTag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetLiveOpsUserDataByXuidAsync(
            ulong xuid,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetLiveOpsUserDataByXuid(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetUserIdsOutput> GetUserIdsAsync(
            ForzaPlayerLookupParameters[] parameters,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetUserIds(parameters.Length, parameters).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetConsolesOutput> GetConsolesAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetConsoles(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);
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

        /// <inheritdoc/>
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview, string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userService.SetIsUnderReview(xuid, isUnderReview).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<LiveOpsService.GetProfileSummaryOutput> GetProfileSummaryAsync(
            ulong xuid,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetProfileSummary(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<LiveOpsService.GetCreditUpdateEntriesOutput> GetCreditUpdateEntriesAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetCreditUpdateEntries(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(
            ulong xuid,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetIsUnderReview(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(
            ulong xuid,
            int[] groupIdFilter,
            int maxResults,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetUserGroupMemberships(xuid, groupIdFilter, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AddToUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userService.AddToUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userService.RemoveFromUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetUserGroups(startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(
            ulong xuid,
            uint maxProfiles,
            string endpoint)
        {
            var userInventoryService = await this.serviceFactory.PrepareUserInventoryServiceAsync(endpoint).ConfigureAwait(false);

            return await userInventoryService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(
            ulong xuid,
            string endpoint)
        {
            var userInventoryService = await this.serviceFactory.PrepareUserInventoryServiceAsync(endpoint).ConfigureAwait(false);

            return await userInventoryService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput>
            GetAdminUserInventoryByProfileIdAsync(int profileId, string endpoint)
        {
            var userInventoryService = await this.serviceFactory.PrepareUserInventoryServiceAsync(endpoint).ConfigureAwait(false);

            return await userInventoryService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.LiveOpsRetrieveForUserExOutput> LiveOpsRetrieveForUserAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.LiveOpsRetrieveForUserEx(xuid, maxResults).ConfigureAwait(false);
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

            return await notificationsManagementService.GetUserGroupMessage(notificationId)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<NotificationsManagementService.SendMessageNotificationToMultipleUsersOutput>
            SendMessageNotificationToMultipleUsersAsync(
                IList<ulong> xuids,
                string message,
                DateTime expireTimeUtc,
                string endpoint)
        {
            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.SendMessageNotificationToMultipleUsers(
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
            if (groupId == 0 && !this.allowGiftingToAllUsers)
            {
                throw new FailedToSendStewardException(
                    "Sending to All User group is blocked outside of the production environment.");
            }

            var notificationsManagementService = await this.serviceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.SendGroupMessageNotification(groupId, message, expireTimeUtc, deviceType != ForzaLiveDeviceType.Invalid, deviceType)
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
        public async Task AdminSendItemGiftAsync(
            ulong recipientXuid,
            InventoryItemType itemType,
            int itemValue,
            string endpoint)
        {
            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            await giftingService.AdminSendItemGift(recipientXuid, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AdminSendItemGroupGiftAsync(
            int groupId,
            InventoryItemType itemType,
            int itemValue,
            string endpoint)
        {
            if (groupId == 0 && !this.allowGiftingToAllUsers)
            {
                throw new FailedToSendStewardException(
                    "Sending to All User group is blocked outside of the production environment.");
            }

            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            await giftingService.AdminSendItemGroupGift(groupId, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(
            int maxResults,
            string endpoint)
        {
            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            return await giftingService.AdminGetSupportedGiftTypes(maxResults).ConfigureAwait(false);
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
            if (groupId == 0 && !this.allowGiftingToAllUsers)
            {
                throw new FailedToSendStewardException(
                    "Sending to All User group is blocked outside of the production environment.");
            }

            var giftingService = await this.serviceFactory.PrepareGiftingServiceAsync(endpoint).ConfigureAwait(false);

            return await giftingService.AdminSendGroupLiveryGift(groupId, liveryId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(
            ulong[] xuids,
            int xuidCount,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetUserBanSummaries(xuids, xuidCount).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetUserBanHistory(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.BanUsersOutput> BanUsersAsync(
            ForzaUserBanParameters[] banParameters,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.BanUsers(banParameters).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ExpireBanEntriesOutput> ExpireBanEntriesAsync(
            ForzaUserExpireBanParameters[] banParameters,
            int entryCount,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.ExpireBanEntries(banParameters, entryCount).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<DeleteBanEntriesOutput> DeleteBanEntriesAsync(
            int[] banParameters,
            string endpoint)
        {
            var userService = await this.serviceFactory.PrepareUserServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.DeleteBanEntries(banParameters).ConfigureAwait(false);
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

        /// <inheritdoc/>
        public async Task<AuctionManagementService.SearchAuctionHouseOutput> GetPlayerAuctionsAsync(
            ForzaAuctionFilters filters,
            string endpoint)
        {
            var auctionService = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await auctionService.SearchAuctionHouse(filters).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<Forza.LiveOps.FH4.Generated.ForzaAuction> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint)
        {
            var auctionService = await this.serviceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);
            var result = await auctionService.GetAuctionData(auctionId).ConfigureAwait(false);
            return result?.auction;
        }

        /// <inheritdoc/>
        public async Task<StorefrontManagementService.SearchUGCOutput> SearchUgcContentAsync(
            ForzaUGCSearchRequest filters,
            ForzaUGCContentType contentType,
            string endpoint,
            bool includeThumbnails = false)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontService.SearchUGC(filters, contentType, includeThumbnails, 5_000).ConfigureAwait(false);
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
        public async Task<StorefrontManagementService.GetUGCObjectOutput> GetPlayerUgcObjectAsync(
            Guid tuneId,
            string endpoint)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontService.GetUGCObject(tuneId).ConfigureAwait(false);
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
        public async Task HideUgcAsync(Guid ugcId, string endpoint)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontServiceAsync(endpoint).ConfigureAwait(false);

            await storefrontService.HideUGC(ugcId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task UnhideUgcAsync(Guid ugcId, ulong xuid, FileType fileType, string endpoint)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontServiceAsync(endpoint).ConfigureAwait(false);

            await storefrontService.UnhideUGC(ugcId, xuid, fileType).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetUgcFeaturedStatusAsync(
            Guid contentId,
            bool isFeatured,
            DateTime featureEndDate,
            DateTime forceFeatureEndDate,
            string endpoint)
        {
            var storefrontService = await this.serviceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            await storefrontService.SetFeatured(contentId, isFeatured, featureEndDate, forceFeatureEndDate).ConfigureAwait(false);
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
    }
}
