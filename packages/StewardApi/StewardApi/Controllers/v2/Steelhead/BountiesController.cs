using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
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
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BountiesController"/> class.
        /// </summary>
        public BountiesController(ISteelheadPegasusService pegasusService, IMapper mapper)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.pegasusService = pegasusService;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets bounty summaries.
        /// </summary>
        [HttpGet("bountySummaries")]
        [SwaggerResponse(200, type: typeof(IEnumerable<SteelheadBountySummary>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetBountiesSummaryAsync()
        {
            var getBounties = this.Services.LiveOpsService.GetActiveBounties(0, BountiesMaxResult);
            var getRivalsEvents = this.pegasusService.GetRivalsEventsAsync();

            await Task.WhenAll(getBounties, getRivalsEvents).ConfigureAwait(true);

            var bountiesOutput = getBounties.GetAwaiter().GetResult();
            var rivalsEventOutput = getRivalsEvents.GetAwaiter().GetResult();
            var rivalsEventDict = rivalsEventOutput.ToDictionary(x => x.TrackId);

            var bounties = this.mapper.SafeMap<IEnumerable<SteelheadBountySummary>>(bountiesOutput.bountyEntries);

            foreach (var bounty in bounties)
            {
                // TODO: Log when a rival is not found. Currently this happens all the time and might still
                // happen all the time until table storage data is cleaned so might not
                // be worth it to overload logs
                if (rivalsEventDict.TryGetValue(bounty.RivalsEventId, out var rivalsEvent))
                {
                    bounty.RivalsEventTitle = rivalsEvent.Name;
                    bounty.RivalsEventDescription = rivalsEvent.Description;
                }
            }

            return this.Ok(bounties);
        }
    }
}
