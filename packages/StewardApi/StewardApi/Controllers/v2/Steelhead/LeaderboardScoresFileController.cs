using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Forza.Scoreboard.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using ScoreType = Forza.Scoreboard.FM8.Generated.ScoreType;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead leaderboards scores files.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/leaderboards/scores/file")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Leaderboards)]
    public class LeaderboardScoresFileController : V2SteelheadControllerBase
    {
        private readonly ISteelheadLeaderboardProvider leaderboardProvider;
        private readonly ILoggingService loggingService;

        // required for background jobs
        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;

        // required for blob storage interactions
        private readonly IBlobStorageProvider blobStorageProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LeaderboardScoresFileController"/> class.
        /// </summary>
        public LeaderboardScoresFileController(
            ISteelheadLeaderboardProvider leaderboardProvider,
            ILoggingService loggingService,
            IJobTracker jobTracker,
            IScheduler scheduler,
            IBlobStorageProvider blobStorageProvider)
        {
            leaderboardProvider.ShouldNotBeNull(nameof(leaderboardProvider));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            blobStorageProvider.ShouldNotBeNull(nameof(blobStorageProvider));

            this.leaderboardProvider = leaderboardProvider;
            this.loggingService = loggingService;
            this.jobTracker = jobTracker;
            this.scheduler = scheduler;
            this.blobStorageProvider = blobStorageProvider;
        }

        /// <summary>
        ///     Creates or Replaces leaderboard scores files.
        /// </summary>
        [HttpPost("generate")]
        [SwaggerResponse(200, type: typeof(BackgroundJob))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Create | ActionAreaLogTags.Leaderboards)]
        [Authorize(Policy = UserAttributeValues.GenerateLeaderboardScoresFile)]
        public async Task<IActionResult> GenerateLeaderboardScoresFile(
            [FromQuery] ScoreboardType scoreboardType,
            [FromQuery] ScoreType scoreType,
            [FromQuery] int trackId,
            [FromQuery] string pivotId,
            [FromQuery] string pegasusEnvironment = null)
        {
            const int scoresToPull = 8_000;

            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            var environment = SteelheadPegasusEnvironment.RetrieveEnvironment(pegasusEnvironment);
            var leaderboard = await this.leaderboardProvider.GetLeaderboardMetadataAsync(scoreboardType, scoreType, trackId, pivotId, environment).ConfigureAwait(true);

            var leaderboardIdentifier = $"{TitleCodeName.Steelhead}_{scoreboardType}_{scoreType}_{trackId}_{pivotId}_{environment}";

            var jobs = await this.jobTracker.GetInProgressJobsAsync().ConfigureAwait(true);

            if (jobs.Any(job => job.Reason != null && job.Reason.Contains("Generate Leaderboard Scores File", StringComparison.InvariantCultureIgnoreCase)))
            {
                return this.Conflict("Leaderboard file generation already in progress, please try again later.");
            }

            var jobId = await this.jobTracker.CreateNewJobAsync(leaderboardIdentifier, requesterObjectId, $"Generate Leaderboard Scores File ({leaderboardIdentifier})", this.Response).ConfigureAwait(true);
            var scoreboardManagementService = this.Services.ScoreboardManagementService;

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var scores = new List<LeaderboardScore>();

                    // Retry for dormant leaderboards, query until you get real data.
                    var retries = 0;
                    var retry = true;
                    var waitTimeInMilliseconds = 1000;

                    do
                    {
                        var results = await this.leaderboardProvider.GetLeaderboardScoresAsync(
                            scoreboardManagementService,
                            scoreboardType,
                            scoreType,
                            trackId,
                            pivotId,
                            new List<DeviceType>(),
                            0,
                            1000).ConfigureAwait(true);

                        if (results.Any())
                        {
                            retry = false;
                        }
                        else
                        {
                            if (retries > 4)
                            {
                                throw new NotFoundStewardException("No scores found.");
                            }

                            Thread.Sleep(waitTimeInMilliseconds);

                            waitTimeInMilliseconds *= 2;
                            retries++;
                        }
                    }
                    while (retry);

                    // Successfully pulling scores, now pull them all.
                    var scoreIndex = 1; // Leaderboards are indexed by ranking, which starts at 1.
                    var keepQuerying = true;

                    while (keepQuerying)
                    {
                        var scoreResults = await this.leaderboardProvider.GetLeaderboardScoresAsync(
                            scoreboardManagementService,
                            scoreboardType,
                            scoreType,
                            trackId,
                            pivotId,
                            new List<DeviceType>(),
                            scoreIndex,
                            scoresToPull).ConfigureAwait(true);

                        if (scoreResults.Count() < scoresToPull)
                        {
                            keepQuerying = false;
                        }

                        scoreIndex += scoresToPull;
                        scores.AddRange(scoreResults);
                    }

                    var csv = new StringBuilder();
                    csv.AppendLine("Position, Xuid, Score, IsClean");

                    foreach (var score in scores)
                    {
                        // TODO: Use gamertag from score object once Services adds it.
                        var newLine = $"{score.Position}, GamertagPlaceholder, {score.Score}, {score.IsClean},";
                        csv.AppendLine(newLine);
                    }

                    await this.blobStorageProvider.SetLeaderboardDataAsync(leaderboardIdentifier, csv.ToString()).ConfigureAwait(true);

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
        ///     Gets metadata for a leaderboard scores file.
        /// </summary>
        [HttpGet("metadata")]
        [SwaggerResponse(200, type: typeof(BlobFileInfo))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Create | ActionAreaLogTags.Leaderboards)]
        [Authorize(Policy = UserAttributeValues.GenerateLeaderboardScoresFile)]
        public async Task<IActionResult> GetLeaderboardScoresFileMetadata(
            [FromQuery] ScoreboardType scoreboardType,
            [FromQuery] ScoreType scoreType,
            [FromQuery] int trackId,
            [FromQuery] string pivotId,
            [FromQuery] string pegasusEnvironment = null)
        {
            var environment = SteelheadPegasusEnvironment.RetrieveEnvironment(pegasusEnvironment);
            var leaderboardIdentifier = $"{TitleCodeName.Steelhead}_{scoreboardType}_{scoreType}_{trackId}_{pivotId}_{environment}";
            var blobInfo = await this.blobStorageProvider.VerifyLeaderboardScoresFileAsync(leaderboardIdentifier).ConfigureAwait(true);

            return this.Ok(blobInfo);
        }

        /// <summary>
        ///     Retrieve leaderboard scores file from blob storage.
        /// </summary>
        [HttpGet("retrieve")]
        [SwaggerResponse(200, type: typeof(Uri))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Create | ActionAreaLogTags.Leaderboards)]
        [Authorize(Policy = UserAttributeValues.GenerateLeaderboardScoresFile)]
        public async Task<IActionResult> RetrieveLeaderboardScoresFile(
            [FromQuery] ScoreboardType scoreboardType,
            [FromQuery] ScoreType scoreType,
            [FromQuery] int trackId,
            [FromQuery] string pivotId,
            [FromQuery] string pegasusEnvironment = null)
        {
            var environment = SteelheadPegasusEnvironment.RetrieveEnvironment(pegasusEnvironment);
            var leaderboard = await this.leaderboardProvider.GetLeaderboardMetadataAsync(scoreboardType, scoreType, trackId, pivotId, environment).ConfigureAwait(true);

            var leaderboardIdentifier = $"{TitleCodeName.Steelhead}_{scoreboardType}_{scoreType}_{trackId}_{pivotId}_{environment}";

            var leaderboardFileUri = await this.blobStorageProvider.GetLeaderboardDataLinkAsync(leaderboardIdentifier);

            return this.Ok(leaderboardFileUri);
        }
    }
}
