using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM8.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <inheritdoc />
    public sealed class SteelheadPlayerDetailsProvider : ISteelheadPlayerDetailsProvider
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 500;

        private readonly ISteelheadService steelheadService;
        private readonly ISteelheadBanHistoryProvider banHistoryProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadPlayerDetailsProvider"/> class.
        /// </summary>
        public SteelheadPlayerDetailsProvider(
            ISteelheadService steelheadService,
            ISteelheadBanHistoryProvider banhistoryProvider,
            IMapper mapper)
        {
            steelheadService.ShouldNotBeNull(nameof(steelheadService));
            banhistoryProvider.ShouldNotBeNull(nameof(banhistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.steelheadService = steelheadService;
            this.banHistoryProvider = banhistoryProvider;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<IdentityResultAlpha>> GetPlayerIdentitiesAsync(
            IList<IdentityQueryAlpha> queries,
            string endpoint)
        {
            queries.ShouldNotBeNull(nameof(queries));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            UserManagementService.GetUserIdsOutput result = null;

            var convertedQueries = this.mapper.SafeMap<ForzaPlayerLookupParameters[]>(queries);

            try
            {
                result = await this.steelheadService.LookupPlayersAsync(convertedQueries, endpoint)
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
        public async Task<SteelheadPlayerDetails> GetPlayerDetailsAsync(string gamertag, string endpoint)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            LiveOpsService.GetLiveOpsUserDataByGamerTagOutput response = null;

            try
            {
                response = await this.steelheadService.GetUserDataByGamertagAsync(gamertag, endpoint)
                    .ConfigureAwait(false);

                if (response.userData.region <= 0) { return null; }
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for Gamertag: {gamertag}.", ex);
            }

            return this.mapper.SafeMap<SteelheadPlayerDetails>(response.userData);
        }

        /// <inheritdoc />
        public async Task<SteelheadPlayerDetails> GetPlayerDetailsAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            LiveOpsService.GetLiveOpsUserDataByXuidOutput response = null;

            try
            {
                response = await this.steelheadService.GetUserDataByXuidAsync(xuid, endpoint)
                    .ConfigureAwait(false);

                if (response.userData.region <= 0) { return null; }
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }

            return this.mapper.SafeMap<SteelheadPlayerDetails>(response.userData);
        }

        /// <inheritdoc />
        public async Task<bool> DoesPlayerExistAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var response = await this.steelheadService.GetUserDataByXuidAsync(xuid, endpoint)
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
                var response = await this.steelheadService.GetUserDataByGamertagAsync(gamertag, endpoint)
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

            UserManagementService.GetConsolesOutput response = null;

            try
            {
                response = await this.steelheadService.GetConsolesAsync(xuid, maxResults, endpoint)
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
                await this.steelheadService.SetConsoleBanStatusAsync(consoleId, isBanned, endpoint)
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
                response = await this.steelheadService.GetSharedConsoleUsersAsync(
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
        public async Task<IList<BanResult>> BanUsersAsync(
            IList<SteelheadBanParameters> banParameters,
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
                        var userResult = await this.steelheadService.GetUserDataByGamertagAsync(
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
                    var result = await this.steelheadService
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
                                        TitleConstants.SteelheadCodeName,
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

            UserManagementService.GetUserBanSummariesOutput result = null;

            try
            {
                if (xuids.Count == 0)
                {
                    return new List<BanSummary>();
                }

                result = await this.steelheadService.GetUserBanSummariesAsync(xuids.ToArray(), endpoint)
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
                var result = await this.steelheadService
                    .GetUserBanHistoryAsync(xuid, DefaultStartIndex, DefaultMaxResults, endpoint)
                    .ConfigureAwait(false);

                if (result.availableCount > DefaultMaxResults)
                {
                    result = await this.steelheadService
                        .GetUserBanHistoryAsync(xuid, DefaultStartIndex, result.availableCount, endpoint)
                        .ConfigureAwait(false);
                }

                var banResults = result.bans.Select(
                    ban => { return LiveOpsBanHistoryMapper.Map(ban, endpoint); }).ToList();
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

            var forzaAuctionFilters = this.mapper.SafeMap<ForzaAuctionFilters>(filters);

            AuctionManagementService.SearchAuctionHouseOutput forzaAuctions = null;

            try
            {
                forzaAuctionFilters.Seller = xuid;
                forzaAuctions = await this.steelheadService.SearchAuctionsAsync(forzaAuctionFilters, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Search player auctions failed.", ex);
            }

            return this.mapper.SafeMap<IList<PlayerAuction>>(forzaAuctions.searchAuctionHouseResult.Auctions);
        }
    }
}
