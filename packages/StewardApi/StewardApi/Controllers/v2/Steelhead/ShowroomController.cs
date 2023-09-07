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
            var carFeaturedShowcases = await this.GetCarFeaturedShowcasesAsync(environment, slot, snapshot);

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
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid);

            var carFeaturedShowcases = await this.GetCarFeaturedShowcasesAsync(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId);

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
            var divisionFeaturedShowcases = await this.GetDivisionFeaturedShowcasesAsync(environment, slot, snapshot);

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
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid);

            var divisionFeaturedShowcases = await this.GetDivisionFeaturedShowcasesAsync(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId);

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
            var manufacturerFeaturedShowcases = await this.GetManufacturerFeaturedShowcasesAsync(environment, slot, snapshot);

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
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid);

            var manufacturerFeaturedShowcases = await this.GetManufacturerFeaturedShowcasesAsync(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId);

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
            var carSales = await this.GetCarSalesAsync(environment, slot, snapshot);

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
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid);

            var carSales = await this.GetCarSalesAsync(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId);

            return this.Ok(carSales);
        }

        /// <summary>
        ///     Gets all featured showcases.
        /// </summary>
        [HttpGet("featuredShowcases")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetFeaturedShowcases()
        {
            var featuredShowcases = await this.steelheadPegasusService.GetFeaturedShowcasesAsync();

            return this.Ok(featuredShowcases);
        }

        private async Task<IEnumerable<LiveOpsContracts.CarFeaturedShowcase>> GetCarFeaturedShowcasesAsync(string environment, string slot, string snapshot)
        {
            try
            {
                var carFeaturedShowcases = await this.steelheadPegasusService.GetCarFeaturedShowcasesAsync(environment, slot, snapshot);

                return carFeaturedShowcases;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car featured showcases.", ex);
            }
        }

        private async Task<IEnumerable<LiveOpsContracts.DivisionFeaturedShowcase>> GetDivisionFeaturedShowcasesAsync(string environment, string slot, string snapshot)
        {
            try
            {
                var divisionFeaturedShowcases = await this.steelheadPegasusService.GetDivisionFeaturedShowcasesAsync(environment, slot, snapshot);

                return divisionFeaturedShowcases;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get division featured showcases.", ex);
            }
        }

        private async Task<IEnumerable<LiveOpsContracts.ManufacturerFeaturedShowcase>> GetManufacturerFeaturedShowcasesAsync(string environment, string slot, string snapshot)
        {
            try
            {
                var manufacturerFeaturedShowcases = await this.steelheadPegasusService.GetManufacturerFeaturedShowcasesAsync(environment, slot, snapshot);

                return manufacturerFeaturedShowcases;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car manufacturer showcases.", ex);
            }
        }

        private async Task<IEnumerable<LiveOpsContracts.CarSale>> GetCarSalesAsync(string environment, string slot, string snapshot)
        {
            try
            {
                var carSales = await this.steelheadPegasusService.GetCarSalesAsync(environment, slot, snapshot);

                return carSales;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car sales.", ex);
            }
        }
    }
}
