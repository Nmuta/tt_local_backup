using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10;
using Turn10.Data.Common;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Controllers.v2;
using Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock car items.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/cars")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock)]
    public sealed class CarsController : V2WoodstockControllerBase
    {
        private readonly IWoodstockItemsProvider itemsProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="CarsController"/> class.
        /// </summary>
        public CarsController(IWoodstockItemsProvider itemsProvider)
        {
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));

            this.itemsProvider = itemsProvider;
        }

        /// <summary>
        ///     Gets the car list.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IEnumerable<SimpleCar>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarsAsync([FromQuery] string slotId = WoodstockPegasusSlot.LiveSteward)
        {
            var cars = await this.itemsProvider.GetCarsAsync<SimpleCar>(slotId).ConfigureAwait(true);
            return this.Ok(cars);
        }

        /// <summary>
        ///     Gets detailed car.
        /// </summary>
        [HttpGet("{carId}")]
        [SwaggerResponse(200, type: typeof(DetailedCar))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarAsync([FromRoute] int carId, [FromQuery] string slotId = WoodstockPegasusSlot.LiveSteward)
        {
            var cars = await this.itemsProvider.GetCarsAsync<DetailedCar>(slotId).ConfigureAwait(true);
            var car = cars.FirstOrDefault(car => car.Id == carId);

            if (car == null)
            {
                throw new NotFoundStewardException($"Could not find car id in CMS. (carId: {carId}) (pegasusSlot: {slotId})");
            }

            return this.Ok(car);
        }
    }
}
