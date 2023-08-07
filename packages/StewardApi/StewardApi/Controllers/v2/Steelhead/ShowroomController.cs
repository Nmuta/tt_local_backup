using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using LiveOpsContracts = Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead showroom.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/showroom")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Showroom)]
    public class ShowroomController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService steelheadPegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ShowroomController"/> class.
        /// </summary>
        public ShowroomController(ISteelheadPegasusService steelheadPegasusService)
        {
            steelheadPegasusService.ShouldNotBeNull(nameof(steelheadPegasusService));

            this.steelheadPegasusService = steelheadPegasusService;
        }

        /// <summary>
        ///     Gets showroom featured car showcase.
        /// </summary>
        [HttpGet("carFeatured")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.CarFeaturedShowcase>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarFeaturedShowcases()
        {
            IEnumerable<LiveOpsContracts.CarFeaturedShowcase> carFeaturedShowcases;

            try
            {
                carFeaturedShowcases = await this.steelheadPegasusService.GetCarFeaturedShowcasesAsync().ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car featured showcases.", ex);
            }

            return this.Ok(carFeaturedShowcases);
        }

        /// <summary>
        ///     Gets showroom featured division showcase.
        /// </summary>
        [HttpGet("divisionFeatured")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.DivisionFeaturedShowcase>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetDivisionFeaturedShowcases()
        {
            IEnumerable<LiveOpsContracts.DivisionFeaturedShowcase> divisionFeaturedShowcases;

            try
            {
                divisionFeaturedShowcases = await this.steelheadPegasusService.GetDivisionFeaturedShowcasesAsync().ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get division featured showcases.", ex);
            }

            return this.Ok(divisionFeaturedShowcases);
        }

        /// <summary>
        ///     Gets showroom featured manufacturer showcase.
        /// </summary>
        [HttpGet("manufacturerFeatured")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.ManufacturerFeaturedShowcase>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetManufacturerFeaturedShowcases()
        {
            IEnumerable<LiveOpsContracts.ManufacturerFeaturedShowcase> manufacturerFeaturedShowcases;

            try
            {
                manufacturerFeaturedShowcases = await this.steelheadPegasusService.GetManufacturerFeaturedShowcasesAsync().ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car manufacturer showcases.", ex);
            }

            return this.Ok(manufacturerFeaturedShowcases);
        }

        /// <summary>
        ///     Gets showroom car sales.
        /// </summary>
        [HttpGet("carSales")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.CarSale>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarSales()
        {
            IEnumerable<LiveOpsContracts.CarSale> carSales;

            try
            {
                carSales = await this.steelheadPegasusService.GetCarSalesAsync().ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car sales.", ex);
            }

            return this.Ok(carSales);
        }
    }
}
