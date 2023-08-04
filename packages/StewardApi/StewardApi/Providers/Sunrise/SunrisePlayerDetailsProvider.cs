using AutoMapper;
using Forza.LiveOps.FH4.Generated;
using Forza.WebServices.FH4.Generated;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using ForzaAuctionFilters = Forza.LiveOps.FH4.Generated.ForzaAuctionFilters;
using ForzaUserBanParameters = Forza.WebServices.FH4.Generated.ForzaUserBanParameters;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunrisePlayerDetailsProvider : ISunrisePlayerDetailsProvider
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 500;
        private const int VipUserGroupId = 1;
        private const int UltimateVipUserGroupId = 2;
        private const int T10EmployeeUserGroupId = 4;
        private const int WhitelistUserGroupId = 6;
        private const int RepairStatsId = 91;

        private readonly ISunriseService sunriseService;
        private readonly ISunriseBanHistoryProvider banHistoryProvider;
        private readonly IMapper mapper;
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunrisePlayerDetailsProvider"/> class.
        /// </summary>
        public SunrisePlayerDetailsProvider(
            ISunriseService sunriseService,
            ISunriseBanHistoryProvider banHistoryProvider,
            IMapper mapper,
            IRefreshableCacheStore refreshableCacheStore)
        {
            sunriseService.ShouldNotBeNull(nameof(sunriseService));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));

            this.sunriseService = sunriseService;
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

            var convertedQueries = this.mapper.SafeMap<ForzaPlayerLookupParameters[]>(queries);

            UserManagementService.GetUserIdsOutput result = null;

            try
            {
                result = await this.sunriseService.GetUserIdsAsync(convertedQueries, endpoint).ConfigureAwait(false);
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
        public async Task<SunrisePlayerDetails> GetPlayerDetailsAsync(string gamertag, string endpoint)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            LiveOpsService.GetLiveOpsUserDataByGamerTagOutput response = null;

            try
            {
                response = await this.sunriseService.GetLiveOpsUserDataByGamerTagAsync(gamertag, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for Gamertag: {gamertag}.", ex);
            }

            return this.mapper.SafeMap<SunrisePlayerDetails>(response.userData);
        }

        /// <inheritdoc />
        public async Task<SunrisePlayerDetails> GetPlayerDetailsAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            LiveOpsService.GetLiveOpsUserDataByXuidOutput response = null;

            try
            {
                response = await this.sunriseService.GetLiveOpsUserDataByXuidAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                if (response.userData.region <= 0)
                {
                    throw new NotFoundStewardException($"No player found for XUID: {xuid}.");
                }
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }

            return this.mapper.SafeMap<SunrisePlayerDetails>(response.userData);
        }

        /// <inheritdoc />
        public async Task<bool> DoesPlayerExistAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.sunriseService.GetLiveOpsUserDataByXuidAsync(xuid, endpoint)
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
                await this.sunriseService.GetLiveOpsUserDataByGamerTagAsync(gamertag, endpoint)
                    .ConfigureAwait(false);

                return true;
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
                response = await this.sunriseService.GetConsolesAsync(xuid, maxResults, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No consoles found for Xuid: {xuid}.", ex);
            }

            return this.mapper.SafeMap<IList<ConsoleDetails>>(response.consoles);
        }

        /// <inheritdoc />
        public async Task<IList<ProfileNote>> GetProfileNotesAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            UserManagementService.GetAdminCommentsOutput response = null;

            try
            {
                response = await this.sunriseService.GetProfileNotesAsync(xuid, 100, endpoint)
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
                await this.sunriseService.AddProfileNoteAsync(xuid, note.Text, note.Author, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Could not add profile note for XUID: {xuid}.", ex);
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
                response = await this.sunriseService.GetSharedConsoleUsersAsync(
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

        /// <inheritdoc/>
        public async Task<SunriseUserFlags> GetUserFlagsAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var userGroupResults = await this.sunriseService
                    .GetUserGroupMembershipsAsync(xuid, Array.Empty<int>(), DefaultMaxResults, endpoint)
                    .ConfigureAwait(false);
                var suspiciousResults = await this.sunriseService.GetIsUnderReviewAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                userGroupResults.userGroups.ShouldNotBeNull(nameof(userGroupResults.userGroups));

                return new SunriseUserFlags
                {
                    IsVip = userGroupResults.userGroups.Any(r => r.Id == VipUserGroupId),
                    IsUltimateVip = userGroupResults.userGroups.Any(r => r.Id == UltimateVipUserGroupId),
                    IsTurn10Employee = userGroupResults.userGroups.Any(r => r.Id == T10EmployeeUserGroupId),
                    IsEarlyAccess = userGroupResults.userGroups.Any(r => r.Id == WhitelistUserGroupId),
                    NeedsStatisticsRepaired = userGroupResults.userGroups.Any(r => r.Id == RepairStatsId),
                    IsUnderReview = suspiciousResults.isUnderReview
                };
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"User flags not found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task SetUserFlagsAsync(ulong xuid, SunriseUserFlags userFlags, string endpoint)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var addGroupList = this.PrepareGroupIds(userFlags, true);
                var removeGroupList = this.PrepareGroupIds(userFlags, false);

                await this.sunriseService.AddToUserGroupsAsync(xuid, addGroupList.ToArray(), endpoint)
                    .ConfigureAwait(false);
                await this.sunriseService.RemoveFromUserGroupsAsync(xuid, removeGroupList.ToArray(), endpoint)
                    .ConfigureAwait(false);
                await this.sunriseService.SetIsUnderReviewAsync(xuid, userFlags.IsUnderReview, endpoint)
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

            LiveOpsService.GetProfileSummaryOutput result = null;

            try
            {
                result = await this.sunriseService.GetProfileSummaryAsync(xuid, endpoint).ConfigureAwait(false);
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
                var creditUpdateId = SunriseCacheKey.MakeCreditUpdatesKey(endpoint, xuid, startIndex, maxResults);

                async Task<IList<CreditUpdate>> CreditUpdates()
                {
                    var result = await this.sunriseService.GetCreditUpdateEntriesAsync(
                            xuid,
                            startIndex,
                            maxResults,
                            endpoint).ConfigureAwait(false);
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
                var backstagePassUpdateId = SunriseCacheKey.MakeBackstagePassKey(endpoint, xuid);

                async Task<IList<BackstagePassUpdate>> BackstagePassUpdates()
                {
                    var result = await this.sunriseService.GetTokenTransactionsAsync(xuid, endpoint)
                        .ConfigureAwait(false);
                    var backstagePasses =
                        this.mapper.SafeMap<IList<BackstagePassUpdate>>(result.transactions.Transactions);

                    this.refreshableCacheStore.PutItem(
                        backstagePassUpdateId,
                        TimeSpan.FromHours(1),
                        backstagePasses);

                    return backstagePasses;
                }

                var result = this.refreshableCacheStore.GetItem<IList<BackstagePassUpdate>>(backstagePassUpdateId)
                             ?? await BackstagePassUpdates().ConfigureAwait(false);

                return result;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No backstage pass updates found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<BanResult>> BanUsersAsync(
            IList<SunriseBanParameters> banParameters,
            string requesterObjectId,
            string endpoint)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            const int maxXuidsPerRequest = 10;

            foreach (var param in banParameters)
            {
                param.FeatureArea.ShouldNotBeNullEmptyOrWhiteSpace(nameof(param.FeatureArea));

                if (param.Xuid == default)
                {
                    if (string.IsNullOrWhiteSpace(param.Gamertag))
                    {
                        throw new InvalidArgumentsStewardException("No XUID or Gamertag provided.");
                    }

                    try
                    {
                        var userResult = await this.sunriseService.GetLiveOpsUserDataByGamerTagAsync(
                                param.Gamertag,
                                endpoint).ConfigureAwait(false);

                        param.Xuid = userResult.userData.qwXuid;
                    }
                    catch (Exception ex)
                    {
                        throw new NotFoundStewardException($"No profile found for Gamertag: {param.Gamertag}.", ex);
                    }
                }
            }

            try
            {
                var banResults = new List<BanResult>();

                for (var i = 0; i < banParameters.Count; i += maxXuidsPerRequest)
                {
                    var paramBatch = banParameters.ToList()
                        .GetRange(i, Math.Min(maxXuidsPerRequest, banParameters.Count - i));
                    var mappedBanParameters = this.mapper.Map<IList<ForzaUserBanParameters>>(paramBatch);
                    var result = await this.sunriseService
                        .BanUsersAsync(mappedBanParameters.ToArray(), endpoint)
                        .ConfigureAwait(false);

                    banResults.AddRange(this.mapper.Map<IList<BanResult>>(result.banResults));
                }

                foreach (var result in banResults)
                {
                    var parameters = banParameters
                        .Where(banAttempt => banAttempt.Xuid == result.Xuid).FirstOrDefault();

                    if (result.Error == null)
                    {
                        try
                        {
                            await
                                this.banHistoryProvider.UpdateBanHistoryAsync(
                                        parameters.Xuid,
                                        TitleConstants.SunriseCodeName,
                                        requesterObjectId,
                                        parameters,
                                        endpoint)
                                    .ConfigureAwait(false);
                        }
                        catch (Exception ex)
                        {
                            result.Error = new FailedToSendStewardError(
                                $"Ban Successful. Ban history upload failed for XUID: {result.Xuid}.",
                                ex);
                        }
                    }
                }

                return banResults;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("User banning has failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<UnbanResult> ExpireBanAsync(
            int banEntryId,
            string endpoint)
        {
            banEntryId.ShouldBeGreaterThanValue(-1);
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var forzaExpireBanParameters = this.mapper.SafeMap<ForzaUserExpireBanParameters>(banEntryId);

            UserService.ExpireBanEntriesOutput result = null;

            try
            {
                ForzaUserExpireBanParameters[] parameterArray = { forzaExpireBanParameters };

                result = await this.sunriseService.ExpireBanEntriesAsync(parameterArray, 1, endpoint)
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
            UserService.DeleteBanEntriesOutput result = null;

            try
            {
                result = await this.sunriseService.DeleteBanEntriesAsync(banEntryIds, endpoint)
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

            UserService.GetUserBanSummariesOutput result = null;

            try
            {
                if (xuids.Count == 0)
                {
                    return new List<BanSummary>();
                }

                result = await this.sunriseService.GetUserBanSummariesAsync(
                    xuids.ToArray(),
                    xuids.Count,
                    endpoint).ConfigureAwait(false);
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
                var result = await this.sunriseService
                    .GetUserBanHistoryAsync(xuid, DefaultStartIndex, DefaultMaxResults, endpoint)
                    .ConfigureAwait(false);

                if (result.availableCount > DefaultMaxResults)
                {
                    result = await this.sunriseService
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
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                await this.sunriseService.SetConsoleBanStatusAsync(consoleId, isBanned, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No console found for Console ID: {consoleId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<PlayerAuction>> GetPlayerAuctionsAsync(
            ulong xuid,
            AuctionFilters filters,
            string endpoint)
        {
            filters.ShouldNotBeNull(nameof(filters));

            var forzaAuctionFilters = this.mapper.SafeMap<ForzaAuctionFilters>(filters);
            AuctionManagementService.SearchAuctionHouseOutput forzaAuctions = null;

            try
            {
                forzaAuctionFilters.Seller = xuid;
                forzaAuctions = await this.sunriseService.GetPlayerAuctionsAsync(forzaAuctionFilters, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Search player auctions failed.", ex);
            }

            return this.mapper.SafeMap<IList<PlayerAuction>>(forzaAuctions.searchAuctionHouseResult.Auctions);
        }

        private IList<int> PrepareGroupIds(SunriseUserFlags userFlags, bool toggleOn)
        {
            var resultGroupIds = new List<int>();
            if (userFlags.IsVip == toggleOn) { resultGroupIds.Add(VipUserGroupId); }
            if (userFlags.IsUltimateVip == toggleOn) { resultGroupIds.Add(UltimateVipUserGroupId); }
            if (userFlags.IsTurn10Employee == toggleOn) { resultGroupIds.Add(T10EmployeeUserGroupId); }
            if (userFlags.IsEarlyAccess == toggleOn) { resultGroupIds.Add(WhitelistUserGroupId); }
            if (userFlags.NeedsStatisticsRepaired == toggleOn) { resultGroupIds.Add(RepairStatsId); }

            return resultGroupIds;
        }
    }
}
