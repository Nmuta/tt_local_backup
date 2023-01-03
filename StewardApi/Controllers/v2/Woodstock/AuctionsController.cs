using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10;
using Turn10.Data.Common;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Controllers.v2;
using Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
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
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock)]
    public sealed class AuctionsController : V2WoodstockControllerBase
    {
        private readonly IActionLogger actionLogger;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AuctionsController"/> class.
        /// </summary>
        public AuctionsController(IActionLogger actionLogger)
        {
            actionLogger.ShouldNotBeNull(nameof(actionLogger));

            this.actionLogger = actionLogger;
        }

        /// <summary>
        ///     Create a single auction.
        /// </summary>
        [HttpPost("createSingle")]
        [SwaggerResponse(200, type: typeof(string))]
        [LogTagDependency(DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Auctions)]
        [Authorize(Policy = UserAttribute.CreateAuctions)]
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
        [Authorize(Policy = UserAttribute.CreateAuctions)]
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
    }
}
