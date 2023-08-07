using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Scoreboard.FH5_main.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock auctions.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/leaderboard")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock)]
    public sealed class LeaderboardController : V2WoodstockControllerBase
    {
        private const int DefaultMaxResults = 100;

        private readonly IWoodstockLeaderboardProvider leaderboardProvider;
        private readonly IActionLogger actionLogger;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LeaderboardController"/> class.
        /// </summary>
        public LeaderboardController(IWoodstockLeaderboardProvider leaderboardProvider, IActionLogger actionLogger, IMapper mapper)
        {
            leaderboardProvider.ShouldNotBeNull(nameof(leaderboardProvider));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.leaderboardProvider = leaderboardProvider;
            this.actionLogger = actionLogger;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets leaderboard metadata.
        /// </summary>
        [HttpGet("metadata")]
        [SwaggerResponse(200, type: typeof(Leaderboard))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta | ActionAreaLogTags.Leaderboards)]
        public async Task<IActionResult> GetLeaderboardMetadata(
            [FromQuery] ScoreboardType scoreboardType,
            [FromQuery] ScoreType scoreType,
            [FromQuery] int trackId,
            [FromQuery] string pivotId,
            [FromQuery] string pegasusEnvironment = null)
        {
            var environment = WoodstockPegasusEnvironment.RetrieveEnvironment(pegasusEnvironment);

            var allLeaderboards = await this.leaderboardProvider.GetLeaderboardsAsync(environment).ConfigureAwait(true);

            var leaderboard = allLeaderboards.FirstOrDefault(leaderboard => leaderboard.ScoreboardTypeId == (int)scoreboardType
                && leaderboard.ScoreTypeId == (int)scoreType
                && leaderboard.TrackId == trackId
                && leaderboard.GameScoreboardId.ToInvariantString() == pivotId);

            if (leaderboard == null)
            {
                throw new BadRequestStewardException($"Could not find leaderboard from provided params. ScoreboardType: " +
                                                     $"{scoreboardType}, ScoreType: {scoreType}, TrackId: {trackId}, PivotId: {pivotId},");
            }

            return this.Ok(leaderboard);
        }

        /// <summary>
        ///     Gets the leaderboard scores.
        /// </summary>
        [HttpGet("scores/top")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LeaderboardScore>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Leaderboards)]
        public async Task<IActionResult> GetLeaderboardScores(
            [FromQuery] ScoreboardType scoreboardType,
            [FromQuery] ScoreType scoreType,
            [FromQuery] int trackId,
            [FromQuery] string pivotId,
            [FromQuery] DeviceType[] deviceTypes,
            [FromQuery] int startAt = 0,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            var scores = await this.GetLeaderboardScoresAsync(
                scoreboardType,
                scoreType,
                trackId,
                pivotId,
                deviceTypes,
                startAt,
                maxResults,
                this.Services).ConfigureAwait(true);

            return this.Ok(scores);
        }

        /// <summary>
        ///     Gets the leaderboard scores around a player.
        /// </summary>
        [HttpGet("scores/near-player/{xuid}")]
        [SwaggerResponse(200, type: typeof(IEnumerable<LeaderboardScore>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Leaderboards)]
        public async Task<IActionResult> GetLeaderboardScoresAroundXuid(
            ulong xuid,
            [FromQuery] ScoreboardType scoreboardType,
            [FromQuery] ScoreType scoreType,
            [FromQuery] int trackId,
            [FromQuery] string pivotId,
            [FromQuery] DeviceType[] deviceTypes,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            xuid.EnsureValidXuid();

            var scores = await this.GetLeaderboardScoresAsync(
                xuid,
                scoreboardType,
                scoreType,
                trackId,
                pivotId,
                deviceTypes,
                maxResults,
                this.Services).ConfigureAwait(true);

            return this.Ok(scores);
        }

        /// <summary>
        ///     Deletes leaderboard scores.
        /// </summary>
        [HttpPost("scores/delete")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Delete | ActionAreaLogTags.Leaderboards)]
        [ManualActionLogging(TitleCodeName.Woodstock, StewardAction.Delete, StewardSubject.Leaderboards)]
        [Authorize(Policy = UserAttributeValues.DeleteLeaderboardScores)]
        public async Task<IActionResult> DeleteLeaderboardScores([FromBody] Guid[] scoreIds)
        {
            if (scoreIds == null || scoreIds.Length <= 0)
            {
                throw new BadRequestStewardException($"Cannot provided empty array of score ids.");
            }

            try
            {
                await this.Services.ScoreboardManagementService.DeleteScores(scoreIds).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to delete leaderboard scores.", ex);
            }

            var deletedScores = scoreIds.Select(scoreId => Invariant($"{scoreId}")).ToList();
            await this.actionLogger.UpdateActionTrackingTableAsync(
                RecipientType.ScoreId,
                deletedScores).ConfigureAwait(true);

            return this.Ok();
        }

        private async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            IEnumerable<DeviceType> deviceTypes,
            int startAt,
            int maxResults,
            WoodstockProxyBundle service)
        {
            service.ShouldNotBeNull(nameof(service));
            pivotId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(pivotId));

            var searchParams = new ForzaSearchLeaderboardsParametersV2()
            {
                ScoreboardType = scoreboardType.ToString(),
                ScoreType = scoreType.ToString(),
                TrackId = trackId,
                PivotId = pivotId,
                DeviceTypes = this.mapper.SafeMap<ForzaLiveDeviceType[]>(deviceTypes),
                ScoreView = ScoreView.All.ToString(),
                Xuid = 1, // 1 = System ID
            };

            try
            {
                var result = await service.ScoreboardManagementService.SearchLeaderboardsV2(searchParams, startAt, maxResults).ConfigureAwait(false);
                var resultRows = result.results.Rows;

                return this.mapper.SafeMap<IEnumerable<LeaderboardScore>>(resultRows);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get leaderboard scores with params: {this.BuildParametersErrorString(searchParams)}", ex);
            }
        }

        private async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            ulong xuid,
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            IEnumerable<DeviceType> deviceTypes,
            int maxResults,
            WoodstockProxyBundle service)
        {
            service.ShouldNotBeNull(nameof(service));
            pivotId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(pivotId));

            var searchParams = new ForzaSearchLeaderboardsParametersV2()
            {
                ScoreboardType = scoreboardType.ToString(),
                ScoreType = scoreType.ToString(),
                TrackId = trackId,
                PivotId = pivotId,
                DeviceTypes = this.mapper.SafeMap<ForzaLiveDeviceType[]>(deviceTypes),
                ScoreView = ScoreView.NearbyMe.ToString(),
                Xuid = xuid,
            };

            try
            {
                var result = await service.ScoreboardManagementService.SearchLeaderboardsV2(searchParams, 0, maxResults).ConfigureAwait(false);
                var resultRows = result.results.Rows;

                if (resultRows.Length <= 0)
                {
                    throw new NotFoundStewardException($"Could not find player XUID in leaderboard: {xuid}");
                }

                return this.mapper.SafeMap<IEnumerable<LeaderboardScore>>(resultRows);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get leaderboard scores with params: {this.BuildParametersErrorString(searchParams)}", ex);
            }
        }

        /// <summary>
        ///     Builds string of leaderboard search parameters used for exception logging purposes.
        /// </summary>
        private string BuildParametersErrorString(ForzaSearchLeaderboardsParametersV2 parameters)
        {
            return $"(Xuid: {parameters.Xuid}) (ScoreboardType: {parameters.ScoreboardType}) (ScoreType: {parameters.ScoreType}) (ScoreView: {parameters.ScoreView}) (TrackId: {parameters.TrackId}) (PivotId: {parameters.PivotId})";
        }
    }
}
