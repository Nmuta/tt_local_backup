using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead bounties.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/bounties")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead)]
    public sealed class BountiesController : V2SteelheadControllerBase
    {
        private const int BountiesMaxResult = 500;
        private readonly ISteelheadPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BountiesController"/> class.
        /// </summary>
        public BountiesController(ISteelheadPegasusService pegasusService)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.pegasusService = pegasusService;
        }

        /// <summary>
        ///     Gets the car manufacturer list.
        /// </summary>
        [HttpGet("test")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarsAsync()
        {
            var getBounties = this.Services.LiveOpsService.GetActiveBounties(0, BountiesMaxResult);
            var getRivalsEvents = this.pegasusService.GetRivalsEventsAsync();

            try
            {
                await Task.WhenAll(getBounties, getRivalsEvents).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get bounties.", ex);
            }

            var bountiesOutput = getBounties.GetAwaiter().GetResult();
            var rivalsEventOutput = getRivalsEvents.GetAwaiter().GetResult();



            // get rivals from pegasusService

            // run both async task

            // get results

            // merge results into new class

            // Only have information needed for search
            // new class can be called abridge or summary

            return this.Ok(bounties);
        }
    }
}
