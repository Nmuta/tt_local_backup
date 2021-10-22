using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH5.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockPlayerDetailsProvider : IWoodstockPlayerDetailsProvider
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 500;
        private const int VipUserGroupId = 1;
        private const int UltimateVipUserGroupId = 2;
        private const int T10EmployeeUserGroupId = 4;
        private const int WhitelistUserGroupId = 6;

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

            try
            {
                var convertedQueries = this.mapper.Map<ForzaPlayerLookupParameters[]>(queries);

                var result = await this.woodstockService.GetUserIds(convertedQueries, endpoint)
                    .ConfigureAwait(false);

                var identityResults = this.mapper.Map<IList<IdentityResultAlpha>>(result.playerLookupResult);
                identityResults.SetErrorsForInvalidXuids();

                return identityResults;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Identity lookup has failed for an unknown reason.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<WoodstockPlayerDetails> GetPlayerDetailsAsync(string gamertag, string endpoint)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.woodstockService.GetUserDataByGamertagAsync(gamertag, endpoint)
                    .ConfigureAwait(false);

                return this.mapper.Map<WoodstockPlayerDetails>(response.userData);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for Gamertag: {gamertag}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<WoodstockPlayerDetails> GetPlayerDetailsAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.woodstockService.GetUserDataByXuidAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                if (response.userData.region <= 0) { return null; }

                return this.mapper.Map<WoodstockPlayerDetails>(response.userData);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<bool> DoesPlayerExistAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.woodstockService.GetUserDataByXuidAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                return response.userData.region > 0;
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

                return response.userData.region > 0;
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

            try
            {
                var response = await this.woodstockService.GetConsolesAsync(xuid, maxResults, endpoint)
                    .ConfigureAwait(false);

                return this.mapper.Map<IList<ConsoleDetails>>(response.consoles);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No consoles found for Xuid: {xuid}.", ex);
            }
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

            try
            {
                var response = await this.woodstockService.GetSharedConsoleUsersAsync(
                        xuid,
                        startIndex,
                        maxResults,
                        endpoint).ConfigureAwait(false);

                return this.mapper.Map<IList<SharedConsoleUser>>(response.sharedConsoleUsers);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No shared console users found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<ProfileNote>> GetProfileNotesAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.woodstockService.GetProfileNotesAsync(xuid, 100, endpoint)
                    .ConfigureAwait(false);

                return this.mapper.Map<IList<ProfileNote>>(response.adminComments);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No profile notes found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task AddProfileNoteAsync(ulong xuid, ProfileNote note, string endpoint)
        {
            note.ShouldNotBeNull(nameof(note));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                await this.woodstockService.AddProfileNote(xuid, note.Text, note.Author, endpoint)
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

                return new WoodstockUserFlags
                {
                    IsVip = userGroupResults.userGroups.Any(r => r.Id == VipUserGroupId),
                    IsUltimateVip = userGroupResults.userGroups.Any(r => r.Id == UltimateVipUserGroupId),
                    IsTurn10Employee = userGroupResults.userGroups.Any(r => r.Id == T10EmployeeUserGroupId),
                    IsEarlyAccess = userGroupResults.userGroups.Any(r => r.Id == WhitelistUserGroupId),
                    IsUnderReview = suspiciousResults.isUnderReview
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
                var addGroupList = this.PrepareGroupIds(userFlags, true);
                var removeGroupList = this.PrepareGroupIds(userFlags, false);

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

            try
            {
                var result = await this.woodstockService.GetProfileSummaryAsync(xuid, endpoint)
                    .ConfigureAwait(false);
                var profileSummary = this.mapper.Map<ProfileSummary>(result.forzaProfileSummary);

                return profileSummary;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Profile summary not found for XUID: {xuid}.", ex);
            }
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
                    var creditUpdates = this.mapper.Map<IList<CreditUpdate>>(result.credityUpdateEntries);

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
                    var backstagePasses = this.mapper.Map<IList<BackstagePassUpdate>>(
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
        public async Task<IList<BanResult>> BanUsersAsync(
            IList<WoodstockBanParameters> banParameters,
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
                        var userResult = await this.woodstockService.GetUserDataByGamertagAsync(
                                param.Gamertag,
                                endpoint)
                            .ConfigureAwait(false);

                        param.Xuid = userResult.userData.qwXuid;
                    }
                    catch (Exception ex)
                    {
                        throw new NotFoundStewardException(
                            $"No profile found for Gamertag: {param.Gamertag}.",
                            ex);
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
                        var result = await this.woodstockService
                            .BanUsersAsync(mappedBanParameters.ToArray(), mappedBanParameters.Count, endpoint)
                            .ConfigureAwait(false);

                        banResults.AddRange(this.mapper.Map<IList<BanResult>>(result.banResults));
                }

                foreach (var result in banResults)
                {
                    var parameters = banParameters.Where(banAttempt => banAttempt.Xuid == result.Xuid)
                        .FirstOrDefault();

                    if (result.Error == null)
                    {
                        try
                        {
                            await
                                this.banHistoryProvider.UpdateBanHistoryAsync(
                                        parameters.Xuid,
                                        TitleConstants.WoodstockCodeName,
                                        requesterObjectId,
                                        parameters,
                                        endpoint).ConfigureAwait(false);
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
        public async Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                if (xuids.Count == 0)
                {
                    return new List<BanSummary>();
                }

                var result = await this.woodstockService.GetUserBanSummariesAsync(xuids.ToArray(), endpoint)
                    .ConfigureAwait(false);

                var banSummaryResults = this.mapper.Map<IList<BanSummary>>(result.banSummaries);

                return banSummaryResults;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Ban Summary lookup has failed.", ex);
            }
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

            try
            {
                var forzaAuctionFilters = this.mapper.Map<ForzaAuctionFilters>(filters);
                forzaAuctionFilters.Seller = xuid;
                var forzaAuctions = await this.woodstockService.GetPlayerAuctions(forzaAuctionFilters, endpoint)
                    .ConfigureAwait(false);

                return this.mapper.Map<IList<PlayerAuction>>(forzaAuctions.searchAuctionHouseResult.Auctions);
            }
            catch (Exception ex)
            {
               throw new UnknownFailureStewardException("Search player auctions failed.", ex);
            }
        }

        private IList<int> PrepareGroupIds(WoodstockUserFlags userFlags, bool toggleOn)
        {
            var resultGroupIds = new List<int>();
            if (userFlags.IsVip == toggleOn) { resultGroupIds.Add(VipUserGroupId); }
            if (userFlags.IsUltimateVip == toggleOn) { resultGroupIds.Add(UltimateVipUserGroupId); }
            if (userFlags.IsTurn10Employee == toggleOn) { resultGroupIds.Add(T10EmployeeUserGroupId); }
            if (userFlags.IsEarlyAccess == toggleOn) { resultGroupIds.Add(WhitelistUserGroupId); }

            return resultGroupIds;
        }
    }
}
