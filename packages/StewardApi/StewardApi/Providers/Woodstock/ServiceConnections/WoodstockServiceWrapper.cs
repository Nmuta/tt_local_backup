﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Forza.UserInventory.FH5_main.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.Services.LiveOps.FH5_main.Generated;
using RareCarShopService = Forza.WebServices.FH5_main.Generated.RareCarShopService;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <inheritdoc />
    public sealed class WoodstockServiceWrapper : IWoodstockService
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.StewardEnvironment,
        };

        private readonly bool allowGiftingToAllUsers;
        private readonly IStewardProjectionWoodstockServiceFactory stewardProjectionServiceFactory;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockServiceWrapper"/> class.
        /// </summary>
        public WoodstockServiceWrapper(
            IConfiguration configuration,
            IStewardProjectionWoodstockServiceFactory stewardProjectionServiceFactory)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);
            stewardProjectionServiceFactory.ShouldNotBeNull(nameof(stewardProjectionServiceFactory));

            this.allowGiftingToAllUsers = configuration[ConfigurationKeyConstants.StewardEnvironment] == "prod";
            this.stewardProjectionServiceFactory = stewardProjectionServiceFactory;
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetLiveOpsUserDataByXuidV2Output> GetUserDataByXuidAsync(
            ulong xuid,
            string endpoint)
        {
            var userLookupService = await this.stewardProjectionServiceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await userLookupService.GetLiveOpsUserDataByXuidV2(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetLiveOpsUserDataByGamerTagV2Output> GetUserDataByGamertagAsync(
            string gamertag,
            string endpoint)
        {
            var userLookupService = await this.stewardProjectionServiceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await userLookupService.GetLiveOpsUserDataByGamerTagV2(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.UserManagementService.GetUserIdsOutput> GetUserIdsAsync(
            ServicesLiveOps.ForzaPlayerLookupParameters[] parameters,
            string endpoint)
        {
            var userService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetUserIds(parameters.Length, parameters).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetProfileSummaryOutput> GetProfileSummaryAsync(
            ulong xuid,
            string endpoint)
        {
            var liveOpsService = await this.stewardProjectionServiceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await liveOpsService.GetProfileSummary(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetCreditUpdateEntriesOutput> GetCreditUpdateEntriesAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var liveOpsService = await this.stewardProjectionServiceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await liveOpsService.GetCreditUpdateEntries(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserManagementService.GetConsolesOutput> GetConsolesAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetConsoles(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startAt,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetSharedConsoleUsers(xuid, startAt, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.UserManagementService.GetAdminCommentsOutput> GetProfileNotesAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetAdminComments(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AddProfileNoteAsync(ulong xuid, string text, string author, string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.AddAdminComment(xuid, text, author).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserGroups(startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(
            ulong xuid,
            int[] groupFilter,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserGroupMemberships(xuid, groupFilter, maxResults)
                .ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.RemoveFromUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AddToUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.AddToUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserManagementService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(
            ulong xuid,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetIsUnderReview(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview, string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userManagementService.SetIsUnderReview(xuid, isUnderReview).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserManagementService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(
            ulong[] xuids,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserBanSummaries(xuids, xuids.Length).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserManagementService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.GetUserBanHistory(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserManagementService.BanUsersOutput> BanUsersAsync(
            ServicesLiveOps.ForzaUserBanParameters[] banParameters,
            int xuidCount,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.BanUsers(banParameters, xuidCount).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserManagementService.ExpireBanEntriesOutput> ExpireBanEntriesAsync(
            ServicesLiveOps.ForzaUserExpireBanParameters[] banParameters,
            int entryCount,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.ExpireBanEntries(banParameters, entryCount).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserManagementService.DeleteBanEntriesOutput> DeleteBanEntriesAsync(
            int[] banParameters,
            string endpoint)
        {
            var userManagementService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userManagementService.DeleteBanEntries(banParameters).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.UserManagementService.GetUserReportWeightOutput> GetUserReportWeightAsync(
            ulong xuid,
            string endpoint)
        {
            var userService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetUserReportWeight(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetUserReportWeightAsync(
            ulong xuid,
            int reportWeight,
            string endpoint)
        {
            var userService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userService.SetUserReportWeight(xuid, reportWeight).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetUserReportWeightTypeAsync(
            ulong xuid,
            ForzaUserReportWeightType reportWeightType,
            string endpoint)
        {
            var userService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userService.SetUserReportWeightType(xuid, reportWeightType).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.UserManagementService.GetHasPlayedRecordOutput> GetHasPlayedRecordAsync(
            ulong xuid,
            Guid externalProfileId,
            string endpoint)
        {
            var userService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetHasPlayedRecord(xuid, externalProfileId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetHasPlayedRecordAsync(
            ulong xuid,
            int title,
            bool hasPlayed,
            string endpoint)
        {
            var userService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userService.SetHasPlayedRecord(xuid, title, hasPlayed).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task ResendProfileHasPlayedNotificationAsync(
            ulong xuid,
            Guid externalProfileId,
            int[] titles,
            string endpoint)
        {
            var userService = await this.stewardProjectionServiceFactory.PrepareUserManagementServiceAsync(endpoint).ConfigureAwait(false);

            await userService.ResendProfileHasPlayedNotification(xuid, externalProfileId, titles).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<RareCarShopService.AdminGetTokenBalanceOutput> GetTokenBalanceAsync(
            ulong xuid,
            string endpoint)
        {
            var rareCarShopService = await this.stewardProjectionServiceFactory.PrepareRareCarShopServiceAsync(endpoint).ConfigureAwait(false);

            return await rareCarShopService.AdminGetTokenBalance(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetTokenBalanceAsync(ulong xuid, uint newBalance, string endpoint)
        {
            var rareCarShopService = await this.stewardProjectionServiceFactory.PrepareRareCarShopServiceAsync(endpoint).ConfigureAwait(false);

            await rareCarShopService.AdminSetBalance(xuid, newBalance).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<RareCarShopService.AdminGetTransactionsOutput> GetTokenTransactionsAsync(
            ulong xuid,
            string endpoint)
        {
            var rareCarShopService = await this.stewardProjectionServiceFactory.PrepareRareCarShopServiceAsync(endpoint).ConfigureAwait(false);

            return await rareCarShopService.AdminGetTransactions(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(
            ulong xuid,
            string endpoint)
        {
            var userService = await this.stewardProjectionServiceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsService.GetAdminUserInventoryByProfileIdOutput>
            GetAdminUserInventoryByProfileIdAsync(int profileId, string endpoint)
        {
            var userService = await this.stewardProjectionServiceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.UserInventoryManagementService.GetAdminUserProfilesOutput>
            GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles, string endpoint)
        {
            var userService = await this.stewardProjectionServiceFactory.PrepareUserInventoryManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await userService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.GiftingManagementService.AdminGetSupportedGiftTypesV2Output>
            AdminGetSupportedGiftTypesAsync(int maxResults, string endpoint)
        {
            var giftingService = await this.stewardProjectionServiceFactory.PrepareGiftingManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await giftingService.AdminGetSupportedGiftTypesV2(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AdminSendItemGiftAsync(
            ulong xuid,
            InventoryItemType itemType,
            int itemValue,
            bool hasExpiration,
            uint expireTimeSpanInDays,
            string endpoint)
        {
            var giftingService = await this.stewardProjectionServiceFactory.PrepareGiftingManagementServiceAsync(endpoint).ConfigureAwait(false);

            // For now using quantity of 1, but we can do better!
            await giftingService.AdminSendItemGiftV3(xuid, itemType.ToString(), itemValue, 1, false, 0).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task AdminSendItemGroupGiftAsync(
            int groupId,
            InventoryItemType itemType,
            int itemValue,
            bool hasExpiration,
            uint expireTimeSpanInDays,
            string endpoint)
        {
            if (groupId == 0 && !this.allowGiftingToAllUsers)
            {
                throw new FailedToSendStewardException(
                    "Sending to All User group is blocked outside of the production environment.");
            }

            var giftingService = await this.stewardProjectionServiceFactory.PrepareGiftingManagementServiceAsync(endpoint).ConfigureAwait(false);

            await giftingService.AdminSendItemGroupGiftV2(groupId, itemType.ToString(), itemValue, hasExpiration, expireTimeSpanInDays).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.GiftingManagementService.AdminSendLiveryGiftOutput> SendCarLiveryAsync(
            ulong[] xuids,
            Guid liveryId,
            bool hasExpiration,
            uint expireTimeSpanInDays,
            string endpoint)
        {
            var giftingService = await this.stewardProjectionServiceFactory.PrepareGiftingManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await giftingService.AdminSendLiveryGift(xuids, xuids.Length, liveryId, hasExpiration, expireTimeSpanInDays).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.GiftingManagementService.AdminSendGroupLiveryGiftOutput> SendCarLiveryAsync(
            int groupId,
            Guid liveryId,
            bool hasExpiration,
            uint expireTimeSpanInDays,
            string endpoint)
        {
            if (groupId == 0 && !this.allowGiftingToAllUsers)
            {
                throw new FailedToSendStewardException(
                    "Sending to All User group is blocked outside of the production environment.");
            }

            var giftingService = await this.stewardProjectionServiceFactory.PrepareGiftingManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await giftingService.AdminSendGroupLiveryGift(groupId, liveryId, hasExpiration, expireTimeSpanInDays).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.NotificationsManagementService.LiveOpsRetrieveForUserOutput>
            LiveOpsRetrieveForUserAsync(ulong xuid, int maxResults, string endpoint)
        {
            var notificationsService = await this.stewardProjectionServiceFactory.PrepareNotificationsManagementServiceAsync(endpoint)
                .ConfigureAwait(false);

            return await notificationsService.LiveOpsRetrieveForUser(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.NotificationsManagementService.GetAllUserGroupMessagesOutput> GetUserGroupNotificationsAsync(
            int groupId,
            int maxResults,
            string endpoint)
        {
            var notificationsManagementService = await this.stewardProjectionServiceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.GetAllUserGroupMessages(groupId, maxResults)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.NotificationsManagementService.GetNotificationOutput> GetPlayerNotificationAsync(
            ulong xuid,
            Guid notificationId,
            string endpoint)
        {
            var notificationsManagementService = await this.stewardProjectionServiceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.GetNotification(xuid, notificationId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.NotificationsManagementService.GetUserGroupMessageOutput> GetUserGroupNotificationAsync(
            Guid notificationId,
            string endpoint)
        {
            var notificationsManagementService = await this.stewardProjectionServiceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await notificationsManagementService.GetUserGroupMessage(notificationId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.NotificationsManagementService.SendMessageNotificationToMultipleUsersOutput>
            SendMessageNotificationToMultipleUsersAsync(
                IList<ulong> xuids,
                string message,
                DateTime sendTimeUtc,
                DateTime expireTimeUtc,
                string endpoint)
        {
            var notificationsService = await this.stewardProjectionServiceFactory.PrepareNotificationsManagementServiceAsync(endpoint)
                .ConfigureAwait(false);

            return await notificationsService.SendMessageNotificationToMultipleUsers(
                xuids.ToArray(),
                xuids.Count,
                message,
                expireTimeUtc,
                string.Empty,
                sendTimeUtc).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.NotificationsManagementService.SendGroupMessageNotificationOutput>
            SendGroupMessageNotificationAsync(
                int groupId,
                string message,
                DateTime sendTimeUtc,
                DateTime expireTimeUtc,
                ServicesLiveOps.ForzaLiveDeviceType deviceType,
                string endpoint)
        {
            if (groupId == 0 && !this.allowGiftingToAllUsers)
            {
                throw new FailedToSendStewardException(
                    "Sending to All User group is blocked outside of the production environment.");
            }

            var notificationsService = await this.stewardProjectionServiceFactory.PrepareNotificationsManagementServiceAsync(endpoint)
                .ConfigureAwait(false);

            return await notificationsService.SendGroupMessageNotification(
                groupId,
                message,
                expireTimeUtc,
                deviceType != ServicesLiveOps.ForzaLiveDeviceType.Invalid,
                deviceType,
                sendTimeUtc).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task EditNotificationAsync(
            Guid notificationId,
            ulong xuid,
            ServicesLiveOps.ForzaCommunityMessageNotificationEditParameters messageParams,
            string endpoint)
        {
            var notificationsManagementService = await this.stewardProjectionServiceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            await notificationsManagementService.EditNotification(notificationId, xuid, messageParams)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task EditGroupNotificationAsync(
            Guid notificationId,
            ServicesLiveOps.ForzaCommunityMessageNotificationEditParameters messageParams,
            string endpoint)
        {
            var notificationsManagementService = await this.stewardProjectionServiceFactory.PrepareNotificationsManagementServiceAsync(endpoint).ConfigureAwait(false);

            await notificationsManagementService.EditGroupNotification(notificationId, messageParams)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.AuctionManagementService.SearchAuctionHouseOutput> GetPlayerAuctionsAsync(
            ServicesLiveOps.ForzaAuctionFilters filters,
            string endpoint)
        {
            var auctionService = await this.stewardProjectionServiceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await auctionService.SearchAuctionHouse(filters).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.ForzaAuction> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint)
        {
            var auctionService = await this.stewardProjectionServiceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);
            var result = await auctionService.GetAuctionData(auctionId).ConfigureAwait(false);
            return result?.auction;
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.AuctionManagementService.DeleteAuctionsOutput> DeleteAuctionAsync(
            Guid auctionId,
            string endpoint)
        {
            var auctionService = await this.stewardProjectionServiceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);
            return await auctionService.DeleteAuctions(new[] { auctionId }).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.AuctionManagementService.GetAuctionBlocklistOutput> GetAuctionBlockListAsync(int maxResults, string endpoint)
        {
            var auctionService = await this.stewardProjectionServiceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await auctionService.GetAuctionBlocklist(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AddAuctionBlocklistEntriesAsync(ServicesLiveOps.ForzaAuctionBlocklistEntry[] blockEntries, string endpoint)
        {
            var auctionService = await this.stewardProjectionServiceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            await auctionService.AddToAuctionBlocklist(blockEntries).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task DeleteAuctionBlocklistEntriesAsync(int[] carIds, string endpoint)
        {
            var auctionService = await this.stewardProjectionServiceFactory.PrepareAuctionManagementServiceAsync(endpoint).ConfigureAwait(false);

            await auctionService.DeleteAuctionBlocklistEntries(carIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.StorefrontManagementService.GetUGCForUserOutput> GetPlayerUgcContentAsync(
            ulong xuid,
            ServicesLiveOps.ForzaUGCContentType contentType,
            string endpoint,
            bool includeThumbnails = false)
        {
            var storefrontManagementService = await this.stewardProjectionServiceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontManagementService.GetUGCForUser(xuid, contentType, includeThumbnails, 8_000, false).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.StorefrontManagementService.SearchUGCOutput> SearchUgcContentAsync(
            ServicesLiveOps.ForzaUGCSearchRequest filters,
            ServicesLiveOps.ForzaUGCContentType contentType,
            string endpoint,
            bool includeThumbnails = false)
        {
            var storefrontManagementService = await this.stewardProjectionServiceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontManagementService.SearchUGC(filters, contentType, includeThumbnails, 5_000).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.StorefrontManagementService.GetUGCLiveryOutput> GetPlayerLiveryAsync(
            Guid liveryId,
            string endpoint)
        {
            var storefrontManagementService = await this.stewardProjectionServiceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontManagementService.GetUGCLivery(liveryId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.StorefrontManagementService.GetUGCPhotoOutput> GetPlayerPhotoAsync(
            Guid photoId,
            string endpoint)
        {
            var storefrontManagementService = await this.stewardProjectionServiceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontManagementService.GetUGCPhoto(photoId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ServicesLiveOps.StorefrontManagementService.GetUGCTuneOutput> GetPlayerTuneAsync(
            Guid tuneId,
            string endpoint)
        {
            var storefrontManagementService = await this.stewardProjectionServiceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            return await storefrontManagementService.GetUGCTune(tuneId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<LiveOpsService.GetUGCEventBlueprintOutput> GetEventBlueprintAsync(
            Guid eventBlueprintId,
            string endpoint)
        {
            var liveOpsService = await this.stewardProjectionServiceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await liveOpsService.GetUGCEventBlueprint(eventBlueprintId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<LiveOpsService.GetUGCCommunityChallengeOutput> GetCommunityChallengeAsync(
            Guid communityChallengeId,
            string endpoint)
        {
            var liveOpsService = await this.stewardProjectionServiceFactory.PrepareLiveOpsServiceAsync(endpoint).ConfigureAwait(false);

            return await liveOpsService.GetUGCCommunityChallenge(communityChallengeId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetUgcFeaturedStatusAsync(
            Guid contentId,
            bool isFeatured,
            DateTime featureEndDate,
            DateTime forceFeatureEndDate,
            string endpoint)
        {
            var storefrontManagementService = await this.stewardProjectionServiceFactory.PrepareStorefrontManagementServiceAsync(endpoint).ConfigureAwait(false);

            await storefrontManagementService.SetFeatured(contentId, isFeatured, featureEndDate, forceFeatureEndDate)
                .ConfigureAwait(false);
        }
    }
}
