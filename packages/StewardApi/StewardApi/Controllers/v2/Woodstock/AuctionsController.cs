using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock auctions.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/auctions")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock)]
    public sealed class AuctionsController : V2WoodstockControllerBase
    {
        private readonly IActionLogger actionLogger;
        private readonly IWoodstockItemsProvider itemsProvider;
        private readonly IWoodstockPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AuctionsController"/> class.
        /// </summary>
        public AuctionsController(IActionLogger actionLogger, IWoodstockItemsProvider itemsProvider, IWoodstockPegasusService pegasusService)
        {
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.actionLogger = actionLogger;
            this.itemsProvider = itemsProvider;
            this.pegasusService = pegasusService;
        }

        /// <summary>
        ///     Create a single auction.
        /// </summary>
        [HttpPost("createSingle")]
        [SwaggerResponse(200, type: typeof(string))]
        [LogTagDependency(DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Auctions)]
        [Authorize(Policy = UserAttributeValues.CreateAuctions)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Add, StewardSubject.Auction)]
        public async Task<IActionResult> CreateSingleAuction(
            [FromQuery] int carId,
            [FromQuery] uint openingPrice,
            [FromQuery] uint buyoutPrice,
            [FromQuery] long durationInMS,
            [FromQuery] ulong sellerId,
            [FromQuery] string liveryId,
            [FromQuery] string tuneId)
        {
            if (!Guid.TryParse(liveryId, out var liveryGuid) && liveryId != null)
            {
                throw new InvalidArgumentsStewardException($"Invalid livery id: {liveryId}");
            }

            if (!Guid.TryParse(tuneId, out var tuneGuid) && tuneId != null)
            {
                throw new InvalidArgumentsStewardException($"Invalid tune id: {tuneId}");
            }

            var cars = await this.itemsProvider.GetCarsAsync<SimpleCar>().ConfigureAwait(true);

            if (!cars.Any(car => car.Id == carId))
            {
                throw new InvalidArgumentsStewardException($"Invalid car id: {carId}");
            }

            var response = await this.Services.AuctionManagementService.CreateAuction(
                carId,
                openingPrice,
                buyoutPrice,
                durationInMS,
                sellerId,
                liveryGuid,
                tuneGuid).ConfigureAwait(true);

            return this.Ok(response.auctionId);
        }

        /// <summary>
        ///     Create bulk auctions.
        /// </summary>
        [HttpPost("createBulk")]
        [SwaggerResponse(200, type: typeof(IList<string>))]
        [LogTagDependency(DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Auctions)]
        [Authorize(Policy = UserAttributeValues.CreateAuctions)]
        [ManualActionLogging(TitleCodeName.Woodstock, StewardAction.Add, StewardSubject.Auction)]
        public async Task<IActionResult> CreateBulkAuctions(
            [FromQuery] ulong sellerId,
            [FromQuery] bool oneOfEveryCar,
            [FromQuery] int numberOfRandomCars,
            [FromQuery] int durationInMinutes)
        {
            var response = await this.Services.AuctionManagementService.CreateBulkAuctions(
                sellerId,
                oneOfEveryCar,
                numberOfRandomCars,
                durationInMinutes).ConfigureAwait(true);

            var createdAuctions = response.createdAuctions.Select(entry => Invariant($"{entry}")).ToList();
            await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.AuctionId, createdAuctions).ConfigureAwait(true);

            return this.Ok(response.createdAuctions);
        }

        /// <summary>
        ///     Gets auction house block list entries.
        /// </summary>
        [HttpGet("blocklist")]
        [SwaggerResponse(200, type: typeof(IList<AuctionBlockListEntry>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta | ActionAreaLogTags.Auctions)]
        public async Task<IActionResult> GetAuctionBlockList([FromQuery] int currentReleaseIndex)
        {
            currentReleaseIndex.ShouldBeGreaterThanValue(0);

            var getCars = this.itemsProvider.GetCarsAsync<DetailedCar>(WoodstockPegasusSlot.LiveSteward);
            var getPegasusBlocklist = this.pegasusService.GetAuctionBannedCarsAsync(WoodstockPegasusSlot.LiveSteward);

            await Task.WhenAll(getPegasusBlocklist, getCars).ConfigureAwait(true);

            var pegasusBlockedCars = getPegasusBlocklist.GetAwaiter().GetResult();
            var cars = (List<DetailedCar>)getCars.GetAwaiter().GetResult();
            var carsDict = cars.ToDictionary(car => car.Id);

            var blockList = pegasusBlockedCars.Select(carId => new AuctionBlockListEntry()
            {
                CarId = carId,
                Description = carsDict.TryGetValue(carId, out var car) ? $"{car.DisplayName}" : "No car name in Pegasus.",
                DoesExpire = false,
            });

            foreach (var detailedCar in cars.Where(x => x.Series > currentReleaseIndex || x.ReleaseDateUtc > DateTime.UtcNow))
            {
                // Check if it's already in the blocklist
                if (blockList.Any(x => x.CarId == detailedCar.Id))
                {
                    continue;
                }

                blockList = blockList.Append(new AuctionBlockListEntry()
                {
                    CarId = (int)detailedCar.Id,
                    Description = carsDict.TryGetValue(detailedCar.Id, out var car) ? $"{car.DisplayName}" : "No car name in Pegasus.",
                    DoesExpire = true,
                    Series = car.Series,
                    ExpireDateUtc = car.ReleaseDateUtc == DateTime.MinValue ? null : detailedCar.ReleaseDateUtc,
                });
            }

            return this.Ok(blockList);
        }
    }
}
