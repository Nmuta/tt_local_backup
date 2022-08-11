using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockServiceManagementProvider : IWoodstockServiceManagementProvider
    {
        private const int GroupLookupMaxResults = 1000;
        private readonly IWoodstockService woodstockService;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockServiceManagementProvider"/> class.
        /// </summary>
        public WoodstockServiceManagementProvider(
            IWoodstockService woodstockService,
            ILoggingService loggingService,
            IMapper mapper)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.woodstockService = woodstockService;
            this.loggingService = loggingService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<LspGroup>> GetLspGroupsAsync(string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var result = await this.woodstockService.GetUserGroupsAsync(0, GroupLookupMaxResults, endpoint)
                    .ConfigureAwait(false);
                var lspGroups = this.mapper.Map<IList<LspGroup>>(result.userGroups);

                if (lspGroups.Count > GroupLookupMaxResults - 50)
                {
                    this.loggingService.LogException(new ApproachingLimitAppInsightsException(
                        $"LSP group lookup for {TitleConstants.WoodstockFullName} is nearing the maximum lookup value."));
                }

                return lspGroups;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No LSP groups found for {TitleConstants.WoodstockFullName}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<AuctionBlockListEntry>> GetAuctionBlockListAsync(int maxResults, string endpoint)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var forzaAuctions = await this.woodstockService.GetAuctionBlockListAsync(maxResults, endpoint).ConfigureAwait(false);

                return this.mapper.Map<IList<AuctionBlockListEntry>>(forzaAuctions.blocklistEntries);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Search auctions block list failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task AddAuctionBlockListEntriesAsync(IList<AuctionBlockListEntry> blockListEntries, string endpoint)
        {
            blockListEntries.ShouldNotBeNull(nameof(blockListEntries));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var convertedEntries = this.mapper.Map<ServicesLiveOps.ForzaAuctionBlocklistEntry[]>(blockListEntries);

                await this.woodstockService.AddAuctionBlocklistEntriesAsync(convertedEntries, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Auction block list additions failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task DeleteAuctionBlockListEntriesAsync(IList<int> carIds, string endpoint)
        {
            carIds.ShouldNotBeNull(nameof(carIds));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                await this.woodstockService.DeleteAuctionBlocklistEntriesAsync(carIds.ToArray(), endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Auction block list deletions failed.", ex);
            }
        }
    }
}
