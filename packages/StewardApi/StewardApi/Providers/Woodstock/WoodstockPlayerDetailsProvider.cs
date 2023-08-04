using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.Services.LiveOps.FH5_main.Generated;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockPlayerDetailsProvider : IWoodstockPlayerDetailsProvider
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 500;
        private const int DefaultReportWeight = 10; // Value players are initialized with.
        private const int VipUserGroupId = 1;
        private const int UltimateVipUserGroupId = 2;
        private const int T10EmployeeUserGroupId = 4;
        private const int WhitelistUserGroupId = 6;
        private const int RaceMarshallUserGroupId = 9;
        private const int CommunityManagerUserGroupId = 5;

        private readonly IWoodstockService woodstockService;
        private readonly IWoodstockBanHistoryProvider banHistoryProvider;
        private readonly IMapper mapper;
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockPlayerDetailsProvider"/> class.
        /// </summary>
        public WoodstockPlayerDetailsProvider(
            IWoodstockService woodstockService,
            IWoodstockBanHistoryProvider banHistoryProvider,
            IMapper mapper,
            IRefreshableCacheStore refreshableCacheStore)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));

            this.woodstockService = woodstockService;
            this.banHistoryProvider = banHistoryProvider;
            this.mapper = mapper;
            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <inheritdoc />
        public async Task<IList<IdentityResultAlpha>> GetPlayerIdentitiesAsync(
            IList<IdentityQueryAlpha> queries,
            string endpoint)
        {
            queries.ShouldNotBeNull(nameof(queries));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var convertedQueries = this.mapper.SafeMap<ServicesLiveOps.ForzaPlayerLookupParameters[]>(queries);

            UserManagementService.GetUserIdsOutput result = null;

            try
            {
                result = await this.woodstockService.GetUserIdsAsync(convertedQueries, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Identity lookup has failed for an unknown reason.", ex);
            }

            var identityResults = this.mapper.SafeMap<IList<IdentityResultAlpha>>(result.playerLookupResult);
            identityResults.SetErrorsForInvalidXuids();

            return identityResults;
        }

        /// <inheritdoc />
        public async Task<WoodstockPlayerDetails> GetPlayerDetailsAsync(string gamertag, string endpoint)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            Forza.WebServices.FH5_main.Generated.LiveOpsService.GetLiveOpsUserDataByGamerTagV2Output response = null;

            try
            {
                response = await this.woodstockService.GetUserDataByGamertagAsync(gamertag, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for Gamertag: {gamertag}.", ex);
            }

            return this.mapper.SafeMap<WoodstockPlayerDetails>(response.userData);
        }

        /// <inheritdoc />
        public async Task<WoodstockPlayerDetails> GetPlayerDetailsAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            Forza.WebServices.FH5_main.Generated.LiveOpsService.GetLiveOpsUserDataByXuidV2Output response = null;

            try
            {
                response = await this.woodstockService.GetUserDataByXuidAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                if (response.userData.Region <= 0) { return null; }
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }

            return this.mapper.SafeMap<WoodstockPlayerDetails>(response.userData);
        }

        /// <inheritdoc />
        public async Task<bool> DoesPlayerExistAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.woodstockService.GetUserDataByXuidAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                return response.userData != null;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<bool> DoesPlayerExistAsync(string gamertag, string endpoint)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.woodstockService.GetUserDataByGamertagAsync(gamertag, endpoint)
                    .ConfigureAwait(false);

                return response.userData.Region > 0;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<IList<ConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            UserManagementService.GetConsolesOutput response = null;

            try
            {
                response = await this.woodstockService.GetConsolesAsync(xuid, maxResults, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No consoles found for Xuid: {xuid}.", ex);
            }

            return this.mapper.SafeMap<IList<ConsoleDetails>>(response.consoles);
        }

        /// <inheritdoc />
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                await this.woodstockService.SetConsoleBanStatusAsync(consoleId, isBanned, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No console found for Console ID: {consoleId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SharedConsoleUser>> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            UserManagementService.GetSharedConsoleUsersOutput response = null;

            try
            {
                response = await this.woodstockService.GetSharedConsoleUsersAsync(
                        xuid,
                        startIndex,
                        maxResults,
                        endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No shared console users found for XUID: {xuid}.", ex);
            }

            return this.mapper.SafeMap<IList<SharedConsoleUser>>(response.sharedConsoleUsers);
        }

        /// <inheritdoc />
        public async Task<IList<ProfileNote>> GetProfileNotesAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            UserManagementService.GetAdminCommentsOutput response = null;

            try
            {
                response = await this.woodstockService.GetProfileNotesAsync(xuid, 100, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No profile notes found for XUID: {xuid}.", ex);
            }

            return this.mapper.SafeMap<IList<ProfileNote>>(response.adminComments);
        }

        /// <inheritdoc />
        public async Task AddProfileNoteAsync(ulong xuid, ProfileNote note, string endpoint)
        {
            note.ShouldNotBeNull(nameof(note));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                await this.woodstockService.AddProfileNoteAsync(xuid, note.Text, note.Author, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Could not add profile note for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc/>
        public async Task<WoodstockUserFlags> GetUserFlagsAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var userGroupResults = await this.woodstockService
                    .GetUserGroupMembershipsAsync(xuid, Array.Empty<int>(), DefaultMaxResults, endpoint)
                    .ConfigureAwait(false);
                var suspiciousResults = await this.woodstockService.GetIsUnderReviewAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                userGroupResults.userGroups.ShouldNotBeNull(nameof(userGroupResults.userGroups));

                var nonStandardUserGroups = NonStandardUserGroupHelpers.GetUserGroups(endpoint);

                return new WoodstockUserFlags
                {
                    IsVip = userGroupResults.userGroups.Any(r => r.Id == VipUserGroupId),
                    IsUltimateVip = userGroupResults.userGroups.Any(r => r.Id == UltimateVipUserGroupId),
                    IsTurn10Employee = userGroupResults.userGroups.Any(r => r.Id == T10EmployeeUserGroupId),
                    IsEarlyAccess = userGroupResults.userGroups.Any(r => r.Id == WhitelistUserGroupId),
                    IsUnderReview = suspiciousResults.isUnderReview,
                    IsRaceMarshall = userGroupResults.userGroups.Any(r => r.Id == RaceMarshallUserGroupId),
                    IsCommunityManager = userGroupResults.userGroups.Any(r => r.Id == CommunityManagerUserGroupId),
                    IsContentCreator = userGroupResults.userGroups.Any(r => r.Id == nonStandardUserGroups.ContentCreatorId),
                };
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"User flags not found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task SetUserFlagsAsync(ulong xuid, WoodstockUserFlags userFlags, string endpoint)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var addGroupList = this.PrepareGroupIds(userFlags, true, endpoint);
                var removeGroupList = this.PrepareGroupIds(userFlags, false, endpoint);

                await this.woodstockService.AddToUserGroupsAsync(xuid, addGroupList.ToArray(), endpoint)
                    .ConfigureAwait(false);
                await this.woodstockService.RemoveFromUserGroupsAsync(xuid, removeGroupList.ToArray(), endpoint)
                    .ConfigureAwait(false);
                await this.woodstockService.SetIsUnderReviewAsync(xuid, userFlags.IsUnderReview, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Update user flags failed for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<ProfileSummary> GetProfileSummaryAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            Forza.WebServices.FH5_main.Generated.LiveOpsService.GetProfileSummaryOutput result = null;

            try
            {
                result = await this.woodstockService.GetProfileSummaryAsync(xuid, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Profile summary not found for XUID: {xuid}.", ex);
            }

            var profileSummary = this.mapper.SafeMap<ProfileSummary>(result.forzaProfileSummary);

            return profileSummary;
        }

        /// <inheritdoc />
        public async Task<IList<CreditUpdate>> GetCreditUpdatesAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var creditUpdateId = WoodstockCacheKey.MakeCreditUpdatesKey(endpoint, xuid, startIndex, maxResults);

                async Task<IList<CreditUpdate>> CreditUpdates()
                {
                    var result = await this.woodstockService.GetCreditUpdateEntriesAsync(
                            xuid,
                            startIndex,
                            maxResults,
                            endpoint)
                        .ConfigureAwait(false);
                    var creditUpdates = this.mapper.SafeMap<IList<CreditUpdate>>(result.credityUpdateEntries);

                    this.refreshableCacheStore.PutItem(creditUpdateId, TimeSpan.FromHours(1), creditUpdates);

                    return creditUpdates;
                }

                var result = this.refreshableCacheStore.GetItem<IList<CreditUpdate>>(creditUpdateId) ??
                             await CreditUpdates().ConfigureAwait(false);

                return result;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No credit updates found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<BackstagePassUpdate>> GetBackstagePassUpdatesAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var backstagePassUpdateId = WoodstockCacheKey.MakeBackstagePassKey(endpoint, xuid);

                async Task<IList<BackstagePassUpdate>> BackstagePassUpdates()
                {
                    var result = await this.woodstockService.GetTokenTransactionsAsync(xuid, endpoint)
                        .ConfigureAwait(false);
                    var backstagePasses = this.mapper.SafeMap<IList<BackstagePassUpdate>>(
                        result.transactions.Transactions);

                    this.refreshableCacheStore.PutItem(
                        backstagePassUpdateId,
                        TimeSpan.FromHours(1),
                        backstagePasses);

                    return backstagePasses;
                }

                var result = this.refreshableCacheStore.GetItem<IList<BackstagePassUpdate>>(backstagePassUpdateId) ??
                             await BackstagePassUpdates().ConfigureAwait(false);

                return result;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No backstage pass updates found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<UnbanResult> ExpireBanAsync(
            int banEntryId,
            string endpoint)
        {
            banEntryId.ShouldBeGreaterThanValue(-1);
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var forzaExpireBanParameters = this.mapper.SafeMap<ServicesLiveOps.ForzaUserExpireBanParameters>(banEntryId);
            UserManagementService.ExpireBanEntriesOutput result = null;

            try
            {
                ServicesLiveOps.ForzaUserExpireBanParameters[] parameterArray = { forzaExpireBanParameters };

                result = await this.woodstockService.ExpireBanEntriesAsync(parameterArray, 1, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to expire ban. (banId: {banEntryId}).", ex);
            }

            return this.mapper.SafeMap<UnbanResult>(result.unbanResults[0]);
        }

        /// <inheritdoc />
        public async Task<UnbanResult> DeleteBanAsync(
            int banEntryId,
            string endpoint)
        {
            banEntryId.ShouldBeGreaterThanValue(-1);
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var banEntryIds = new int[] { banEntryId };

            UserManagementService.DeleteBanEntriesOutput result = null;

            try
            {
                result = await this.woodstockService.DeleteBanEntriesAsync(banEntryIds, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete ban. (banId: {banEntryId}).", ex);
            }

            return this.mapper.SafeMap<UnbanResult>(result.unbanResults[0]);
        }

        /// <inheritdoc />
        public async Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            UserManagementService.GetUserBanSummariesOutput result = null;

            try
            {
                if (xuids.Count == 0)
                {
                    return new List<BanSummary>();
                }

                result = await this.woodstockService.GetUserBanSummariesAsync(xuids.ToArray(), endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Ban Summary lookup has failed.", ex);
            }

            var banSummaryResults = this.mapper.SafeMap<IList<BanSummary>>(result.banSummaries);

            return banSummaryResults;
        }

        /// <inheritdoc />
        public async Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var result = await this.woodstockService
                    .GetUserBanHistoryAsync(xuid, DefaultStartIndex, DefaultMaxResults, endpoint)
                    .ConfigureAwait(false);

                if (result.availableCount > DefaultMaxResults)
                {
                    result = await this.woodstockService
                        .GetUserBanHistoryAsync(xuid, DefaultStartIndex, result.availableCount, endpoint)
                        .ConfigureAwait(false);
                }

                var banResults = result.bans
                    .Select(ban => { return LiveOpsBanHistoryMapper.Map(ban, endpoint); }).ToList();
                banResults.Sort((x, y) => DateTime.Compare(y.ExpireTimeUtc, x.ExpireTimeUtc));

                return banResults;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No ban history found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<PlayerAuction>> GetPlayerAuctionsAsync(
            ulong xuid,
            AuctionFilters filters,
            string endpoint)
        {
            filters.ShouldNotBeNull(nameof(filters));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var forzaAuctionFilters = this.mapper.SafeMap<ServicesLiveOps.ForzaAuctionFilters>(filters);

            AuctionManagementService.SearchAuctionHouseOutput forzaAuctions = null;

            try
            {
                forzaAuctionFilters.Seller = xuid;
                forzaAuctions = await this.woodstockService.GetPlayerAuctionsAsync(forzaAuctionFilters, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Search player auctions failed.", ex);
            }

            return this.mapper.SafeMap<IList<PlayerAuction>>(forzaAuctions.searchAuctionHouseResult.Auctions);
        }

        /// <inheritdoc />
        public async Task<UserReportWeight> GetUserReportWeightAsync(
            ulong xuid,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            UserManagementService.GetUserReportWeightOutput response = null;

            try
            {
                response = await this.woodstockService.GetUserReportWeightAsync(xuid, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to get user report weight.", ex);
            }

            return this.mapper.SafeMap<UserReportWeight>(response);
        }

        /// <inheritdoc />
        public async Task SetUserReportWeightAsync(
            ulong xuid,
            UserReportWeightType reportWeightType,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var mappedReportWeightType = this.mapper.SafeMap<ForzaUserReportWeightType>(reportWeightType);

            try
            {
                await this.woodstockService.SetUserReportWeightTypeAsync(xuid, mappedReportWeightType, endpoint).ConfigureAwait(false);

                if (reportWeightType == UserReportWeightType.Default)
                {
                    await this.woodstockService.SetUserReportWeightAsync(xuid, DefaultReportWeight, endpoint).ConfigureAwait(false);
                }
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to get set report weight.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<HasPlayedRecord>> GetHasPlayedRecordAsync(
            ulong xuid,
            Guid externalProfileId,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var response = await this.woodstockService.GetHasPlayedRecordAsync(xuid, externalProfileId, endpoint).ConfigureAwait(false);
            var results = this.mapper.SafeMap<IList<HasPlayedRecord>>(response.records);
            return results;
        }

        /// <inheritdoc />
        public async Task ResendProfileHasPlayedNotificationAsync(
            ulong xuid,
            Guid externalProfileId,
            IList<int> gameTitles,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            await this.woodstockService.ResendProfileHasPlayedNotificationAsync(xuid, externalProfileId, gameTitles.ToArray(), endpoint).ConfigureAwait(false);
        }

        private IList<int> PrepareGroupIds(WoodstockUserFlags userFlags, bool toggleOn, string endpoint)
        {
            var nonStandardUserGroups = NonStandardUserGroupHelpers.GetUserGroups(endpoint);

            var resultGroupIds = new List<int>();
            if (userFlags.IsVip == toggleOn) { resultGroupIds.Add(VipUserGroupId); }
            if (userFlags.IsUltimateVip == toggleOn) { resultGroupIds.Add(UltimateVipUserGroupId); }
            if (userFlags.IsTurn10Employee == toggleOn) { resultGroupIds.Add(T10EmployeeUserGroupId); }
            if (userFlags.IsEarlyAccess == toggleOn) { resultGroupIds.Add(WhitelistUserGroupId); }
            if (userFlags.IsRaceMarshall == toggleOn) { resultGroupIds.Add(RaceMarshallUserGroupId); }
            if (userFlags.IsCommunityManager == toggleOn) { resultGroupIds.Add(CommunityManagerUserGroupId); }
            if (userFlags.IsContentCreator == toggleOn) { resultGroupIds.Add(nonStandardUserGroups.ContentCreatorId); }

            return resultGroupIds;
        }
    }
}
