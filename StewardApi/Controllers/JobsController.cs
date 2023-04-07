using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.QueryParams;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for jobs.
    /// </summary>
    [Route("api/v1/jobs")]
    [ApiController]
    [Authorize]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    public sealed class JobsController : ControllerBase
    {
        private readonly IJobTracker jobTracker;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;
        private readonly IScheduler scheduler;

        /// <summary>
        ///     Initializes a new instance of the <see cref="JobsController"/> class.
        /// </summary>
        public JobsController(
            IJobTracker jobTracker,
            ILoggingService loggingService,
            IMapper mapper,
            IScheduler scheduler)
        {
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));
            scheduler.ShouldNotBeNull(nameof(scheduler));

            this.jobTracker = jobTracker;
            this.loggingService = loggingService;
            this.mapper = mapper;
            this.scheduler = scheduler;
        }

        /// <summary>
        ///     Creates a fake background job that never ends.
        /// </summary>
        [HttpPost("fake/in-progress/{jobTimeInMilliseconds}")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [Authorize(Policy = UserAttribute.AdminFeature)]
        public async Task<IActionResult> PostFakeOngoingAsync(
            int jobTimeInMilliseconds,
            [FromBody] object postBody)
        {
            var objectId = this.User?.UserClaims()?.ObjectId;
            var jobId = await this.jobTracker.CreateNewJobAsync(postBody.ToJson(), objectId, "Fake Job", this.Response).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    await Task.Delay(jobTimeInMilliseconds, cancellationToken).ConfigureAwait(true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Fake background job failed {jobId}", ex));

                    await this.jobTracker.UpdateJobAsync(jobId, objectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }

        /// <summary>
        ///     Creates a fake background job that ends in failure.
        /// </summary>
        [HttpPost("fake/failure/{jobTimeInMilliseconds}")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [Authorize(Policy = UserAttribute.AdminFeature)]
        public async Task<IActionResult> PostFakeFailureAsync(
            int jobTimeInMilliseconds,
            [FromBody] object postBody)
        {
            var objectId = this.User?.UserClaims()?.ObjectId;
            var jobId = await this.jobTracker.CreateNewJobAsync(postBody.ToJson(), objectId, "Fake Job", this.Response).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    await Task.Delay(jobTimeInMilliseconds, cancellationToken).ConfigureAwait(true);

                    await this.jobTracker
                        .UpdateJobAsync(
                            jobId,
                            objectId,
                            BackgroundJobStatus.Failed,
                            postBody)
                        .ConfigureAwait(true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Fake background job failed {jobId}", ex));

                    await this.jobTracker.UpdateJobAsync(jobId, objectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }

        /// <summary>
        ///     Creates a fake background job that ends in success.
        /// </summary>
        [HttpPost("fake/success/{jobTimeInMilliseconds}")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [Authorize(Policy = UserAttribute.AdminFeature)]
        public async Task<IActionResult> PostFakeSuccessAsync(
            int jobTimeInMilliseconds,
            [FromBody] object postBody)
        {
            var objectId = this.User?.UserClaims()?.ObjectId;
            var jobId = await this.jobTracker.CreateNewJobAsync(postBody.ToJson(), objectId, "Fake Job", this.Response).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    await Task.Delay(jobTimeInMilliseconds, cancellationToken).ConfigureAwait(true);

                    await this.jobTracker
                        .UpdateJobAsync(
                            jobId,
                            objectId,
                            BackgroundJobStatus.Completed,
                            postBody)
                        .ConfigureAwait(true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Fake background job failed {jobId}", ex));

                    await this.jobTracker.UpdateJobAsync(jobId, objectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }

        /// <summary>
        ///     Gets the background job by ID.
        /// </summary>
        [HttpGet("jobId({jobId})")]
        [SwaggerResponse(200, type: typeof(BackgroundJob))]
        public async Task<IActionResult> GetStatusAsync(string jobId)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));

            var status = await this.jobTracker.GetJobStatusAsync(jobId).ConfigureAwait(true);

            var output = this.mapper.SafeMap<BackgroundJob>(status);

            return this.Ok(output);
        }

        /// <summary>
        ///     Gets all of the "InProgress" jobs.
        /// </summary>
        [HttpGet("inProgress")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(IList<BackgroundJob>))]
        public async Task<IActionResult> GetInProgressJobs()
        {
            var results = await this.jobTracker.GetInProgressJobsAsync().ConfigureAwait(true);

            var outputResults = this.mapper.SafeMap<IList<BackgroundJob>>(results);

            return this.Ok(outputResults);
        }

        /// <summary>
        ///     Gets the background jobs for a given user.
        /// </summary>
        [HttpGet("userObjectId({userObjectId})")]
        [SwaggerResponse(200, type: typeof(IList<BackgroundJob>))]
        public async Task<IActionResult> GetJobsByUserAsync(string userObjectId, [FromQuery] TimeSpanQueryParam resultsFrom)
        {
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));

            var jobs = await this.jobTracker.GetJobsByUserAsync(userObjectId, resultsFrom.Value).ConfigureAwait(true);

            var output = this.mapper.SafeMap<IList<BackgroundJob>>(jobs);

            return this.Ok(output);
        }
    }
}