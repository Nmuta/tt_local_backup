using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH4.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunriseServiceManagementProvider : ISunriseServiceManagementProvider
    {
        private const int GroupLookupMaxResults = 1000;
        private readonly ISunriseService sunriseService;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseServiceManagementProvider"/> class.
        /// </summary>
        public SunriseServiceManagementProvider(
            ISunriseService sunriseService,
            ILoggingService loggingService,
            IMapper mapper)
        {
            sunriseService.ShouldNotBeNull(nameof(sunriseService));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.sunriseService = sunriseService;
            this.loggingService = loggingService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<LspGroup>> GetLspGroupsAsync(string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var result = await this.sunriseService.GetUserGroupsAsync(0, GroupLookupMaxResults, endpoint)
                    .ConfigureAwait(false);
                var lspGroups = this.mapper.Map<IList<LspGroup>>(result.userGroups);

                if (lspGroups.Count > GroupLookupMaxResults - 50)
                {
                    this.loggingService.LogException(new ApproachingLimitAppInsightsException(
                        $"LSP group lookup for {TitleConstants.SunriseFullName} is nearing the maximum lookup value."));
                }

                return lspGroups;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No LSP groups found for {TitleConstants.SunriseFullName}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<AuctionBlocklistEntry>> GetAuctionBlocklistAsync(int maxResults, string endpoint)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var forzaAuctions = await this.sunriseService.GetAuctionBlockListAsync(maxResults, endpoint).ConfigureAwait(false);

                return this.mapper.Map<IList<AuctionBlocklistEntry>>(forzaAuctions.blocklistEntries);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Search auctions blocklist failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task AddAuctionBlocklistEntriesAsync(IList<AuctionBlocklistEntry> blocklistEntries, string endpoint)
        {
            blocklistEntries.ShouldNotBeNull(nameof(blocklistEntries));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var convertedEntries = this.mapper.Map<ForzaAuctionBlocklistEntry[]>(blocklistEntries);

                await this.sunriseService.AddAuctionBlocklistEntriesAsync(convertedEntries, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Auction blocklist additions failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task DeleteAuctionBlocklistEntriesAsync(IList<int> carIds, string endpoint)
        {
            carIds.ShouldNotBeNull(nameof(carIds));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                await this.sunriseService.DeleteAuctionBlocklistEntriesAsync(carIds.ToArray(), endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Auction blocklist deletions failed.", ex);
            }
        }
    }
}
