using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH4.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunriseServiceManagementProvider : ISunriseServiceManagementProvider
    {
        private readonly ISunriseService sunriseService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseServiceManagementProvider"/> class.
        /// </summary>
        public SunriseServiceManagementProvider(
            ISunriseService sunriseService,
            IMapper mapper)
        {
            sunriseService.ShouldNotBeNull(nameof(sunriseService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.sunriseService = sunriseService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<LspGroup>> GetLspGroupsAsync(int startIndex, int maxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var result = await this.sunriseService.GetUserGroupsAsync(startIndex, maxResults)
                    .ConfigureAwait(false);
                var lspGroups = this.mapper.Map<IList<LspGroup>>(result.userGroups);

                return lspGroups;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No LSP groups found for {TitleConstants.SunriseFullName}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<AuctionBlocklistEntry>> GetAuctionBlocklistAsync(int maxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var forzaAuctions = await this.sunriseService.GetAuctionBlockListAsync(maxResults).ConfigureAwait(false);

                return this.mapper.Map<IList<AuctionBlocklistEntry>>(forzaAuctions.blocklistEntries);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Search auctions blocklist failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task AddAuctionBlocklistEntriesAsync(IList<AuctionBlocklistEntry> blocklistEntries)
        {
            blocklistEntries.ShouldNotBeNull(nameof(blocklistEntries));

            try
            {
                var convertedEntries = this.mapper.Map<ForzaAuctionBlocklistEntry[]>(blocklistEntries);

                await this.sunriseService.AddAuctionBlocklistEntriesAsync(convertedEntries).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Auction blocklist additions failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task DeleteAuctionBlocklistEntriesAsync(IList<int> carIds)
        {
            carIds.ShouldNotBeNull(nameof(carIds));

            try
            {
                await this.sunriseService.DeleteAuctionBlocklistEntriesAsync(carIds.ToArray()).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Auction blocklist deletions failed.", ex);
            }
        }
    }
}
