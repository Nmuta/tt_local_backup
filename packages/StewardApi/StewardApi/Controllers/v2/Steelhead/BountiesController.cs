using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Scoreboard.FM8.Generated;
using Forza.WebServices.LiveOpsObjects.FM8.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead bounties.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/bounty")]
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
        [HttpGet("summaries")]
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

        /// <summary>
        ///     Gets a bounty detail.
        /// </summary>
        [HttpGet("{bountyId}")]
        [SwaggerResponse(200, type: typeof(SteelheadBounty))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetBountyDetailAsync(string bountyId)
        {
            var parsedBountyId = bountyId.TryParseGuidElseThrow(nameof(bountyId));

            var bountiesOutput = await this.Services.LiveOpsService.GetActiveBounties(0, BountiesMaxResult).ConfigureAwait(false);

            var bounty = bountiesOutput.bountyEntries.FirstOrDefault(x => x.uniqueId == parsedBountyId);
            if (bounty == null)
            {
                throw new NotFoundStewardException($"Bounty could not be found: {parsedBountyId}");
            }

            var bountyOutput = this.mapper.SafeMap<SteelheadBounty>(bounty);

            var getUserGroup = this.Services.UserManagementService.GetUserGroupUsers(bounty.userGroupId, 0, 1);
            var getRivalsEvents = this.pegasusService.GetRivalsEventsAsync();

            await Task.WhenAll(getUserGroup, getRivalsEvents).ConfigureAwait(true);

            var userGroup = getUserGroup.GetAwaiter().GetResult();
            var rivalsEvents = getRivalsEvents.GetAwaiter().GetResult();

            var rivalsEvent = rivalsEvents.FirstOrDefault(x => x.Id == bounty.rivalEventId);
            if (rivalsEvent != null)
            {
                bountyOutput.RivalsEvent = rivalsEvent;
            }

            if (userGroup == null)
            {
                throw new NotFoundStewardException($"User group could not be  found: {bounty.userGroupId}");
            }

            bountyOutput.PlayerRewardedCount = userGroup.available;
            var thresholdLeaderboardEntry = await this.GetThresholdEntry(bounty).ConfigureAwait(false);

            bountyOutput.PositionThreshold = thresholdLeaderboardEntry.Position;
            bountyOutput.TimeThreshold = thresholdLeaderboardEntry.Score;

            return this.Ok(bountyOutput);
        }

        private async Task<ForzaRankedLeaderboardRow> GetThresholdEntry(ForzaBountyEntry bounty)
        {
            var thresholdLeaderboardEntry = new ForzaRankedLeaderboardRow();

            if (bounty.targetXuid > 0)
            {
                var searchParams = new ForzaSearchLeaderboardsParametersV2()
                {
                    ScoreboardType = bounty.scoreboardType,
                    ScoreType = bounty.scoreType,
                    TrackId = bounty.trackId,
                    PivotId = bounty.pivotId,
                    ScoreView = ScoreView.All.ToString(),
                    Xuid = bounty.targetXuid,
                };

                var result = await this.Services.ScoreboardManagementService.SearchLeaderboardsV2(searchParams, 0, 1).ConfigureAwait(false);
                thresholdLeaderboardEntry = result.results.UserRow;
            }
            else
            {
                var searchParams = new ForzaSearchLeaderboardsParametersV2()
                {
                    ScoreboardType = bounty.scoreboardType,
                    ScoreType = bounty.scoreType,
                    TrackId = bounty.trackId,
                    PivotId = bounty.pivotId,
                    ScoreView = ScoreView.All.ToString(),
                    Xuid = 1, // 1 = System ID
                };

                var result = await this.Services.ScoreboardManagementService.SearchLeaderboardsV2(searchParams, 0, 1).ConfigureAwait(false);
                var targetRank = result.results.TotalRowCount * bounty.targetPercentage / 100;

                if (targetRank != 0)
                {
                    var getRankResult = await this.Services.ScoreboardManagementService.GetScoresByRankV2(
                        bounty.scoreboardType,
                        bounty.scoreType,
                        bounty.trackId,
                        int.Parse(bounty.pivotId),
                        new int[] { (int)targetRank }).ConfigureAwait(false);

                    thresholdLeaderboardEntry = getRankResult.results[0].Entry;
                }
            }

            return thresholdLeaderboardEntry;
        }
    }
}
