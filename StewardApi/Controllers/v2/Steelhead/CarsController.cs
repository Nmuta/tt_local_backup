using System;
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
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Controllers.v2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead car items.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/cars")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead)]
    public sealed class CarsController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="CarsController"/> class.
        /// </summary>
        public CarsController(ISteelheadPegasusService pegasusService)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.pegasusService = pegasusService;
        }

        /// <summary>
        ///     Gets the car manufacturer list.
        /// </summary>
        [HttpGet("reference")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarsAsync()
        {
            var cars = await this.pegasusService.GetCarsReferenceAsync().ConfigureAwait(true);

            return this.Ok(cars);
        }

        /// <summary>
        ///     Gets the car manufacturer list.
        /// </summary>
        [HttpGet("manufacturers")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarManufacturersAsync()
        {
            var carMakes = await this.pegasusService.GetCarMakesAsync().ConfigureAwait(true);

            return this.Ok(carMakes);
        }
    }
}
