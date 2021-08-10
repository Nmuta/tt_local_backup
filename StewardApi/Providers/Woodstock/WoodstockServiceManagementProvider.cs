using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH5.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockServiceManagementProvider : IWoodstockServiceManagementProvider
    {
        private readonly IWoodstockService woodstockService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockServiceManagementProvider"/> class.
        /// </summary>
        public WoodstockServiceManagementProvider(
            IWoodstockService woodstockService,
            IMapper mapper)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.woodstockService = woodstockService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<LspGroup>> GetLspGroupsAsync(int startIndex, int maxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var result = await this.woodstockService.GetUserGroupsAsync(startIndex, maxResults)
                    .ConfigureAwait(false);
                var lspGroups = this.mapper.Map<IList<LspGroup>>(result.userGroups);

                return lspGroups;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No LSP groups found for {TitleConstants.WoodstockFullName}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<AuctionBlocklistEntry>> GetAuctionBlocklistAsync(int maxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var forzaAuctions = await this.woodstockService.GetAuctionBlockList(maxResults).ConfigureAwait(false);

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

                await this.woodstockService.AddAuctionBlocklistEntriesAsync(convertedEntries).ConfigureAwait(false);
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
                await this.woodstockService.DeleteAuctionBlocklistEntries(carIds.ToArray()).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Auction blocklist deletions failed.", ex);
            }
        }
    }
}
