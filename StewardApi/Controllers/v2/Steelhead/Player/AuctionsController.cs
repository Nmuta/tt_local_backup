using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Handles requests for Steelhead player auctions.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/auctions")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.CommunityManager)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.Auctions)]
    public class AuctionsController : V2SteelheadControllerBase
    {
        private readonly ISteelheadItemsProvider itemsProvider;
        private readonly IKustoProvider kustoProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AuctionsController"/> class.
        /// </summary>
        public AuctionsController(ISteelheadItemsProvider itemsProvider, IKustoProvider kustoProvider, IMapper mapper)
        {
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.itemsProvider = itemsProvider;
            this.kustoProvider = kustoProvider;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<PlayerAuction>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Auctions)]
        public async Task<IActionResult> GetPlayerAuctions(
            ulong xuid,
            [FromQuery] short carId = short.MaxValue,
            [FromQuery] short makeId = short.MaxValue,
            [FromQuery] string status = "Any",
            [FromQuery] string sort = "ClosingDateDescending")
        {
            carId.ShouldNotBeNull(nameof(carId));
            makeId.ShouldNotBeNull(nameof(makeId));
            status.ShouldNotBeNull(nameof(status));
            sort.ShouldNotBeNull(nameof(sort));

            if (!Enum.TryParse(status, out AuctionStatus statusEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(AuctionStatus)} provided: {status}");
            }

            if (!Enum.TryParse(sort, out AuctionSort sortEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(AuctionSort)} provided: {sort}");
            }

            var auctions = new List<PlayerAuction>();

            try
            {
                var forzaAuctionFilters = this.mapper.Map<ForzaAuctionFilters>(new AuctionFilters(carId, makeId, statusEnum, sortEnum));
                forzaAuctionFilters.Seller = xuid;
                var forzaAuctions = await this.Services.AuctionManagementService.SearchAuctionHouse(forzaAuctionFilters)
                    .ConfigureAwait(true);

                auctions.AddRange(this.mapper.Map<IList<PlayerAuction>>(forzaAuctions.searchAuctionHouseResult.Auctions));
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to search player auctions. (XUID: {xuid})", ex);
            }

            var cars = await this.itemsProvider.GetCarsAsync().ConfigureAwait(true);
            var carsDict = cars.ToDictionary(car => car.Id);

            foreach (var auction in auctions)
            {
                auction.ItemName = carsDict.TryGetValue(auction.ModelId, out var car) ? $"{car.Make} {car.Model}" : "No car name in Pegasus.";
            }

            return this.Ok(auctions);
        }

        /// <summary>
        ///     Gets a log of player auction actions.
        /// </summary>
        [HttpGet("log")]
        [SwaggerResponse(200, type: typeof(IList<AuctionHistoryEntry>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Auctions)]
        public async Task<IActionResult> GetPlayerAuctionLog(ulong xuid, [FromQuery] string skipToken = null)
        {
            DateTime? skipTokenUtc = null;
            if (!string.IsNullOrWhiteSpace(skipToken))
            {
                if (!DateTimeOffset.TryParse(skipToken, out var skipTokenOffset))
                {
                    throw new BadRequestStewardException($"Invalid skipToken value '{skipToken}'. Could not convert to date-time.");
                }

                skipTokenUtc = skipTokenOffset.UtcDateTime;
            }

            var auctionLog = await this.kustoProvider.GetAuctionLogAsync(KustoGameDbSupportedTitle.Steelhead, xuid, skipTokenUtc).ConfigureAwait(true);

            return this.Ok(auctionLog);
        }
    }
}
