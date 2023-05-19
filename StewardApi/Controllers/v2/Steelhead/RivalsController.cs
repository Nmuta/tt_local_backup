using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SteelheadLiveOpsContent;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
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
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IEnumerable<RivalsEvent>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetRivalsEvents()
        {
            var getRivalsEvents = this.steelheadPegasusService.GetRivalsEventsAsync();
            var getTracks = this.steelheadPegasusService.GetTracksAsync();

            try
            {
                await Task.WhenAll(getRivalsEvents, getTracks).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get rivals events.", ex);
            }

            var getRivalsEventsResults = getRivalsEvents.GetAwaiter().GetResult();
            var getTracksResults = getTracks.GetAwaiter().GetResult();

            foreach (var rivalsEvent in getRivalsEventsResults)
            {
                var trackData = getTracksResults.FirstOrDefault(track => track.id == rivalsEvent.TrackId);
                rivalsEvent.TrackName = trackData != null ? $"{trackData.MediaName} - {trackData.DisplayName}" : string.Empty;
            }

            return this.Ok(getRivalsEventsResults);
        }
    }
}
