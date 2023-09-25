using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Scoreboard.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.Services.LiveOps.FM8.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using ScoreType = Forza.Scoreboard.FM8.Generated.ScoreType;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead leaderboards.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/leaderboards")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Leaderboards)]
    public class LeaderboardsController : V2SteelheadControllerBase
    {
        private const int DefaultMaxResults = 100;
        private const int LeaderboardTalentMaxResults = 500;
        private const int LeaderboardTalentGroupId = 31;

        private readonly ISteelheadLeaderboardProvider leaderboardProvider;
        private readonly IMapper mapper;
        private readonly IActionLogger actionLogger;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LeaderboardsController"/> class.
        /// </summary>
        public LeaderboardsController(
            ISteelheadLeaderboardProvider leaderboardProvider,
            IMapper mapper,
            IActionLogger actionLogger)
        {
            leaderboardProvider.ShouldNotBeNull(nameof(leaderboardProvider));
            mapper.ShouldNotBeNull(nameof(mapper));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));

            this.leaderboardProvider = leaderboardProvider;
            this.mapper = mapper;
            this.actionLogger = actionLogger;
        }

        /// <summary>
        ///     Gets the leaderboard list.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IEnumerable<Leaderboard>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Leaderboards)]
        public async Task<IActionResult> GetLeaderboards([FromQuery] string pegasusEnvironment = null)
        {
            var environment = SteelheadPegasusEnvironment.RetrieveEnvironment(pegasusEnvironment);

            var leaderboards = await this.leaderboardProvider.GetLeaderboardsAsync(environment).ConfigureAwait(true);

            return this.Ok(leaderboards);
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
            var environment = SteelheadPegasusEnvironment.RetrieveEnvironment(pegasusEnvironment);

            var leaderboard = await this.leaderboardProvider.GetLeaderboardMetadataAsync(scoreboardType, scoreType, trackId, pivotId, environment).ConfigureAwait(true);

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
            var scores = await this.leaderboardProvider.GetLeaderboardScoresAsync(
                this.Services,
                scoreboardType,
                scoreType,
                trackId,
                pivotId,
                deviceTypes,
                startAt,
                maxResults).ConfigureAwait(true);

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

            var scores = await this.leaderboardProvider.GetLeaderboardScoresAsync(
                this.Services,
                xuid,
                scoreboardType,
                scoreType,
                trackId,
                pivotId,
                deviceTypes,
                maxResults).ConfigureAwait(true);

            return this.Ok(scores);
        }

        /// <summary>
        ///     Retrieves talented leaderboard players.
        /// </summary>
        [HttpGet("talent")]
        [SwaggerResponse(200, type: typeof(IList<IdentityResultAlpha>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetLeaderboardTalent()
        {
            UserManagementService.GetUserGroupUsersOutput leaderboardTalent = null;

            UserManagementService.GetUserIdsOutput result = null;

            leaderboardTalent = await this.Services.UserManagementService.GetUserGroupUsers(LeaderboardTalentGroupId, 0, LeaderboardTalentMaxResults).ConfigureAwait(true);

            var convertedQueries = this.mapper.SafeMap<ForzaPlayerLookupParameters[]>(leaderboardTalent.xuids);

            result = await this.Services.UserManagementService.GetUserIds(convertedQueries.Length, convertedQueries).ConfigureAwait(true);

            var identityResults = this.mapper.SafeMap<IList<IdentityResultAlpha>>(result.playerLookupResult);
            identityResults.SetErrorsForInvalidXuids();

            return this.Ok(identityResults.Where(x => x.Error == null));
        }

        /// <summary>
        ///     Deletes leaderboard scores.
        /// </summary>
        [HttpPost("scores/delete")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Delete | ActionAreaLogTags.Leaderboards)]
        [ManualActionLogging(TitleCodeName.Steelhead, StewardAction.Delete, StewardSubject.Leaderboards)]
        [Authorize(Policy = UserAttributeValues.DeleteLeaderboardScores)]
        public async Task<IActionResult> DeleteLeaderboardScores([FromBody] Guid[] scoreIds)
        {
            await this.leaderboardProvider.DeleteLeaderboardScoresAsync(this.Services, scoreIds).ConfigureAwait(true);

            var deletedScores = scoreIds.Select(scoreId => Invariant($"{scoreId}")).ToList();

            await this.actionLogger.UpdateActionTrackingTableAsync(
                RecipientType.ScoreId,
                deletedScores).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
