using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead Rivals event.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/rivals")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Rivals)]
    public class RivalsController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService steelheadPegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="RivalsController"/> class.
        /// </summary>
        public RivalsController(ISteelheadPegasusService steelheadPegasusService)
        {
            steelheadPegasusService.ShouldNotBeNull(nameof(steelheadPegasusService));

            this.steelheadPegasusService = steelheadPegasusService;
        }

        /// <summary>
        ///     Gets all rivals events.
        /// </summary>
        [HttpGet("events")]
        [SwaggerResponse(200, type: typeof(IEnumerable<RivalsEvent>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetRivalsEvents(
            [FromQuery] string environment,
            [FromQuery] string slot,
            [FromQuery] string snapshot)
        {
            var rivalsEvents = await this.GetRivalsEventsAsync(environment, slot, snapshot).ConfigureAwait(true);

            return this.Ok(rivalsEvents);
        }

        /// <summary>
        ///     Gets all rivals events.
        /// </summary>
        [HttpGet("player/{xuid}/events")]
        [SwaggerResponse(200, type: typeof(IEnumerable<RivalsEvent>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetRivalsEvents(ulong xuid)
        {
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid).ConfigureAwait(true);

            var rivalsEvents = await this.GetRivalsEventsAsync(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId).ConfigureAwait(true);

            return this.Ok(rivalsEvents);
        }

        /// <summary>
        ///     Gets all rivals events reference.
        /// </summary>
        [HttpGet("reference")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetRivalsEventsReference()
        {
            var rivalEvents = await this.steelheadPegasusService.GetRivalsEventsReferenceAsync().ConfigureAwait(true);

            return this.Ok(rivalEvents);
        }

        /// <summary>
        ///     Gets all rivals event categories.
        /// </summary>
        [HttpGet("categories")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetRivalsEventCategories()
        {
            var rivalCategories = await this.steelheadPegasusService.GetRivalsEventCategoriesAsync().ConfigureAwait(true);

            return this.Ok(rivalCategories);
        }

        private async Task<IEnumerable<RivalsEvent>> GetRivalsEventsAsync(string environment, string slot,  string snapshot)
        {
            return await this.steelheadPegasusService.GetRivalsEventsAsync(environment, slot, snapshot).ConfigureAwait(false);
        }
    }
}
