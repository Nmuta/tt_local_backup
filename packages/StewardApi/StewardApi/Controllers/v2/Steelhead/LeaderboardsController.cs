using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Scoreboard.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Azure;
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

        // required for background jobs
        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;

        // required for blob storage interactions
        private readonly IBlobStorageProvider blobStorageProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LeaderboardsController"/> class.
        /// </summary>
        public LeaderboardsController(
            ISteelheadPegasusService pegasusService,
            ILoggingService loggingService,
            IMapper mapper,
            IActionLogger actionLogger,
            IJobTracker jobTracker,
            IScheduler scheduler,
            IBlobStorageProvider blobStorageProvider)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            blobStorageProvider.ShouldNotBeNull(nameof(blobStorageProvider));

            this.pegasusService = pegasusService;
            this.loggingService = loggingService;
            this.mapper = mapper;
            this.actionLogger = actionLogger;
            this.jobTracker = jobTracker;
            this.scheduler = scheduler;
            this.blobStorageProvider = blobStorageProvider;
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

            var leaderboard = await this.GetLeaderboardMetadataAsync(scoreboardType, scoreType, trackId, pivotId, environment).ConfigureAwait(true);

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
        ///     Updates leaderboard scores files.
        /// </summary>
        [HttpPut("scores/generate")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Update | ActionAreaLogTags.Leaderboards)]
        [Authorize(Policy = UserAttribute.GenerateLeaderboardScoresFile)]
        public async Task<IActionResult> GenerateLeaderboardScoresFile(
            [FromQuery] ScoreboardType scoreboardType,
            [FromQuery] ScoreType scoreType,
            [FromQuery] int trackId,
            [FromQuery] string pivotId,
            [FromQuery] string pegasusEnvironment = null)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            //used to clear out existing job if I kill process early
            //await this.jobTracker.UpdateJobAsync("a31e9d43-963d-481d-bfdf-0b0d2d7f3baf", requesterObjectId, BackgroundJobStatus.Failed, null).ConfigureAwait(true);
            var environment = SteelheadPegasusEnvironment.RetrieveEnvironment(pegasusEnvironment);
            var leaderboard = await this.GetLeaderboardMetadataAsync(scoreboardType, scoreType, trackId, pivotId, environment).ConfigureAwait(true);

            var jobs = await this.jobTracker.GetInProgressJobsAsync().ConfigureAwait(true);

            if (jobs.Any(job => job.Reason != null && job.Reason.Contains("Generate Leaderboard Scores File")))
            {
                return this.Conflict("Leaderboard file generation already in progress, please try again later.");
            }

            // Is the leaderboard the correct thing to pass in as first parameter, it should be 'request body' but there really isn't one in this API.
            var jobId = await this.jobTracker.CreateNewJobAsync(leaderboard.Id.ToString(), requesterObjectId, $"Generate Leaderboard Scores File ({leaderboard.Id})", this.Response).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    

                    await this.blobStorageProvider.SetLeaderboardDataAsync(leaderboard.Id).ConfigureAwait(true);

                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Completed, null).ConfigureAwait(true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Background job failed {jobId}", ex));

                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed)
                        .ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);
            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId({jobId})"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
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
        ///     Gets leaderboard metadata.
        /// </summary>
        private async Task<Leaderboard> GetLeaderboardMetadataAsync(
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            string pegasusEnvironment)
        {
            var allLeaderboards = await this.GetLeaderboardsAsync(pegasusEnvironment).ConfigureAwait(true);

            var leaderboard = allLeaderboards.FirstOrDefault(leaderboard => leaderboard.ScoreboardTypeId == (int)scoreboardType
                && leaderboard.ScoreTypeId == (int)scoreType
                && leaderboard.TrackId == trackId
                && leaderboard.GameScoreboardId.ToString() == pivotId);

            if (leaderboard == null)
            {
                throw new BadRequestStewardException($"Could not find leaderboard from provided params. ScoreboardType: " +
                                                     $"{scoreboardType}, ScoreType: {scoreType}, TrackId: {trackId}, PivotId: {pivotId},");
            }

            return leaderboard;
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

            var result = await this.Services.ScoreboardManagementService.SearchLeaderboardsV2(searchParams, startAt, maxResults).ConfigureAwait(false);

            return this.mapper.SafeMap<IEnumerable<LeaderboardScore>>(result.results.Rows);
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

            var result = await this.Services.ScoreboardManagementService.SearchLeaderboardsV2(searchParams, 0, maxResults).ConfigureAwait(false);

            if (result.results.Rows.Length <= 0)
            {
                throw new NotFoundStewardException($"Could not find player XUID in leaderboard: {xuid}");
            }

            return this.mapper.SafeMap<IEnumerable<LeaderboardScore>>(result.results.Rows);
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

            await this.Services.ScoreboardManagementService.DeleteScores(scoreIds).ConfigureAwait(false);
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
