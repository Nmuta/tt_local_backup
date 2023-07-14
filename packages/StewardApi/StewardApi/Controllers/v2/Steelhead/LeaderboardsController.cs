using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Scoreboard.FM8.Generated;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.Services.LiveOps.FM8.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

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
        private const int LeaderboardTalentGroupId = 23; // This is currently pointing at Studio user group Live Ops Devs. We will need to replace this with actual prod usergroup once we have a prod LSP

        private readonly ISteelheadPegasusService pegasusService;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;
        private readonly IActionLogger actionLogger;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LeaderboardsController"/> class.
        /// </summary>
        public LeaderboardsController(ISteelheadPegasusService pegasusService, ILoggingService loggingService, IMapper mapper, IActionLogger actionLogger)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));

            this.pegasusService = pegasusService;
            this.loggingService = loggingService;
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

            var leaderboards = await this.GetLeaderboardsAsync(environment).ConfigureAwait(true);

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

            var allLeaderboards = await this.GetLeaderboardsAsync(environment).ConfigureAwait(true);

            var leaderboard = allLeaderboards.FirstOrDefault(leaderboard => leaderboard.ScoreboardTypeId == (int)scoreboardType
                && leaderboard.ScoreTypeId == (int)scoreType
                && leaderboard.TrackId == trackId
                && leaderboard.GameScoreboardId.ToString() == pivotId);

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

            var scores = await this.GetLeaderboardScoresAsync(
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

            try
            {
                leaderboardTalent = await this.Services.UserManagementService.GetUserGroupUsers(LeaderboardTalentGroupId, 0, LeaderboardTalentMaxResults).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to lookup users in leaderboard talent user group. (userGroupId: {LeaderboardTalentGroupId})", ex);
            }

            var convertedQueries = this.mapper.SafeMap<ForzaPlayerLookupParameters[]>(leaderboardTalent.xuids);

            try
            {
                result = await this.Services.UserManagementService.GetUserIds(convertedQueries.Length, convertedQueries).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get users IDs for player lookup parameters. (userGroupId: {LeaderboardTalentGroupId})", ex);
            }

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
        [Authorize(Policy = UserAttribute.DeleteLeaderboardScores)]
        public async Task<IActionResult> DeleteLeaderboardScores([FromBody] Guid[] scoreIds)
        {
            await this.DeleteLeaderboardScoresAsync(scoreIds).ConfigureAwait(true);

            var deletedScores = scoreIds.Select(scoreId => Invariant($"{scoreId}")).ToList();

            await this.actionLogger.UpdateActionTrackingTableAsync(
                RecipientType.ScoreId,
                deletedScores).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets leaderboard metadata.
        /// </summary>
        [SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll")]
        private async Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync(string pegasusEnvironment)
        {
            var exceptions = new List<Exception>();
            var getPegasusLeaderboards = this.pegasusService.GetLeaderboardsAsync(pegasusEnvironment).SuccessOrDefault(Array.Empty<Leaderboard>(), exceptions);
            var getCarClasses = this.pegasusService.GetCarClassesAsync(pegasusEnvironment).SuccessOrDefault(Array.Empty<CarClass>(), new Action<Exception>(ex =>
            {
                // Leaderboards will work without car class association. Log custom exception for tracking purposes.
                this.loggingService.LogException(new AppInsightsException("Failed to get car classes from Pegasus when building leaderboards", ex));
            }));

            await Task.WhenAll(getPegasusLeaderboards, getCarClasses).ConfigureAwait(false);

            if (getPegasusLeaderboards.IsFaulted)
            {
                throw new UnknownFailureStewardException(
                    "Failed to get leaderboards from Pegasus",
                    getPegasusLeaderboards.Exception);
            }

            var leaderboards = getPegasusLeaderboards.GetAwaiter().GetResult();

            if (getCarClasses.IsCompletedSuccessfully)
            {
                var carClasses = getCarClasses.GetAwaiter().GetResult();
                var carClassesDict = carClasses.ToDictionary(carClass => carClass.Id);
                foreach (var leaderboard in leaderboards)
                {
                    if (carClassesDict.TryGetValue(leaderboard.CarClassId, out CarClass carClass))
                    {
                        leaderboard.CarClass = carClass.DisplayName;
                    }
                }

            }

            return leaderboards;
        }

        /// <summary>
        ///     Gets leaderboard scores.
        /// </summary>
        private async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            IEnumerable<DeviceType> deviceTypes,
            int startAt,
            int maxResults)
        {
            pivotId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(pivotId));

            var searchParams = new ForzaSearchLeaderboardsParametersV2()
            {
                ScoreboardType = scoreboardType.ToString(),
                ScoreType = scoreType.ToString(),
                TrackId = trackId,
                PivotId = pivotId,
                ScoreView = ScoreView.All.ToString(),
                Xuid = 1, // 1 = System ID
            };

            // Only include device type in search params if they're relevant
            if (deviceTypes.Where(type => (int)type >= 0).Any())
            {
                searchParams.DeviceTypes = this.mapper.SafeMap<ForzaLiveDeviceType[]>(deviceTypes);
            }

            try
            {
                var result = await this.Services.ScoreboardManagementService.SearchLeaderboardsV2(searchParams, startAt, maxResults).ConfigureAwait(false);

                return this.mapper.SafeMap<IEnumerable<LeaderboardScore>>(result.results.Rows);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get leaderboard scores with params: {this.BuildParametersErrorString(searchParams)}", ex);
            }
        }

        /// <summary>
        ///     Gets leaderboard scores near user.
        /// </summary>
        private async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            ulong xuid,
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            IEnumerable<DeviceType> deviceTypes,
            int maxResults)
        {
            pivotId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(pivotId));

            var searchParams = new ForzaSearchLeaderboardsParametersV2()
            {
                ScoreboardType = scoreboardType.ToString(),
                ScoreType = scoreType.ToString(),
                TrackId = trackId,
                PivotId = pivotId,
                ScoreView = ScoreView.NearbyMe.ToString(),
                Xuid = xuid,
            };

            // Only include device type in search params if they're relevant
            if (deviceTypes.Where(type => (int)type >= 0).Any())
            {
                searchParams.DeviceTypes = this.mapper.SafeMap<ForzaLiveDeviceType[]>(deviceTypes);
            }

            try
            {

                var result = await this.Services.ScoreboardManagementService.SearchLeaderboardsV2(searchParams, 0, maxResults).ConfigureAwait(false);

                if (result.results.Rows.Length <= 0)
                {
                    throw new NotFoundStewardException($"Could not find player XUID in leaderboard: {xuid}");
                }

                return this.mapper.SafeMap<IEnumerable<LeaderboardScore>>(result.results.Rows);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get leaderboard scores with params: {this.BuildParametersErrorString(searchParams)}", ex);
            }
        }

        /// <summary>
        ///     Delete leaderboard scores.
        /// </summary>
        private async Task DeleteLeaderboardScoresAsync(Guid[] scoreIds)
        {
            if (scoreIds.Length <= 0)
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
