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
        public async Task<IActionResult> GetCarFeaturedShowcases(
            [FromQuery] string environment,
            [FromQuery] string slot,
            [FromQuery] string snapshot)
        {
            var carFeaturedShowcases = await this.GetCarFeaturedShowcasesAsync(environment, slot, snapshot).ConfigureAwait(false);

            return this.Ok(carFeaturedShowcases);
        }

        /// <summary>
        ///     Gets showroom featured car showcase.
        /// </summary>
        [HttpGet("player/{xuid}/carFeatured")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.CarFeaturedShowcase>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarFeaturedShowcases(ulong xuid)
        {
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid).ConfigureAwait(true);

            var carFeaturedShowcases = await this.GetCarFeaturedShowcasesAsync(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId).ConfigureAwait(false);

            return this.Ok(carFeaturedShowcases);
        }

        /// <summary>
        ///     Gets showroom featured division showcase.
        /// </summary>
        [HttpGet("divisionFeatured")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.DivisionFeaturedShowcase>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetDivisionFeaturedShowcases(
            [FromQuery] string environment,
            [FromQuery] string slot,
            [FromQuery] string snapshot)
        {
            var divisionFeaturedShowcases = await this.GetDivisionFeaturedShowcasesAsync(environment, slot, snapshot).ConfigureAwait(false);

            return this.Ok(divisionFeaturedShowcases);
        }

        /// <summary>
        ///     Gets showroom featured division showcase.
        /// </summary>
        [HttpGet("player/{xuid}/divisionFeatured")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.DivisionFeaturedShowcase>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetDivisionFeaturedShowcases(ulong xuid)
        {
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid).ConfigureAwait(true);

            var divisionFeaturedShowcases = await this.GetDivisionFeaturedShowcasesAsync(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId).ConfigureAwait(false);

            return this.Ok(divisionFeaturedShowcases);
        }

        /// <summary>
        ///     Gets showroom featured manufacturer showcase.
        /// </summary>
        [HttpGet("manufacturerFeatured")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.ManufacturerFeaturedShowcase>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetManufacturerFeaturedShowcases(
            [FromQuery] string environment,
            [FromQuery] string slot,
            [FromQuery] string snapshot)
        {
            var manufacturerFeaturedShowcases = await this.GetManufacturerFeaturedShowcasesAsync(environment, slot, snapshot).ConfigureAwait(false);

            return this.Ok(manufacturerFeaturedShowcases);
        }

        /// <summary>
        ///     Gets showroom featured manufacturer showcase.
        /// </summary>
        [HttpGet("player/{xuid}/manufacturerFeatured")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.ManufacturerFeaturedShowcase>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetManufacturerFeaturedShowcases(ulong xuid)
        {
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid).ConfigureAwait(true);

            var manufacturerFeaturedShowcases = await this.GetManufacturerFeaturedShowcasesAsync(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId).ConfigureAwait(false);

            return this.Ok(manufacturerFeaturedShowcases);
        }

        /// <summary>
        ///     Gets showroom car sales.
        /// </summary>
        [HttpGet("carSales")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.CarSale>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarSales(
            [FromQuery] string environment,
            [FromQuery] string slot,
            [FromQuery] string snapshot)
        {
            var carSales = await this.GetCarSalesAsync(environment, slot, snapshot).ConfigureAwait(false);

            return this.Ok(carSales);
        }

        /// <summary>
        ///     Gets showroom car sales.
        /// </summary>
        [HttpGet("player/{xuid}/carSales")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LiveOpsContracts.CarSale>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarSales(ulong xuid)
        {
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid).ConfigureAwait(true);

            var carSales = await this.GetCarSalesAsync(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId).ConfigureAwait(false);

            return this.Ok(carSales);
        }

        private async Task<IEnumerable<LiveOpsContracts.CarFeaturedShowcase>> GetCarFeaturedShowcasesAsync(string environment, string slot, string snapshot)
        {
            IEnumerable<LiveOpsContracts.CarFeaturedShowcase> carFeaturedShowcases;

            try
            {
                carFeaturedShowcases = await this.steelheadPegasusService.GetCarFeaturedShowcasesAsync(environment, slot, snapshot).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car featured showcases.", ex);
            }

            return carFeaturedShowcases;
        }

        private async Task<IEnumerable<LiveOpsContracts.DivisionFeaturedShowcase>> GetDivisionFeaturedShowcasesAsync(string environment, string slot, string snapshot)
        {
            IEnumerable<LiveOpsContracts.DivisionFeaturedShowcase> divisionFeaturedShowcases;

            try
            {
                divisionFeaturedShowcases = await this.steelheadPegasusService.GetDivisionFeaturedShowcasesAsync(environment, slot, snapshot).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get division featured showcases.", ex);
            }

            return divisionFeaturedShowcases;
        }

        private async Task<IEnumerable<LiveOpsContracts.ManufacturerFeaturedShowcase>> GetManufacturerFeaturedShowcasesAsync(string environment, string slot, string snapshot)
        {
            IEnumerable<LiveOpsContracts.ManufacturerFeaturedShowcase> manufacturerFeaturedShowcases;

            try
            {
                manufacturerFeaturedShowcases = await this.steelheadPegasusService.GetManufacturerFeaturedShowcasesAsync(environment, slot, snapshot).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car manufacturer showcases.", ex);
            }

            return manufacturerFeaturedShowcases;
        }

        private async Task<IEnumerable<LiveOpsContracts.CarSale>> GetCarSalesAsync(string environment, string slot, string snapshot)
        {
            IEnumerable<LiveOpsContracts.CarSale> carSales;

            try
            {
                carSales = await this.steelheadPegasusService.GetCarSalesAsync(environment, slot, snapshot).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car sales.", ex);
            }

            return carSales;
        }
    }
}
