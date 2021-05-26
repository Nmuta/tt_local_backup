using System;
using System.Collections.Generic;
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Authorization;
using System.Xml;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for jobs.
    /// </summary>
    [Route("api/v1/jobs")]
    [ApiController]
    [Authorize]
    public sealed class JobsController : ControllerBase
    {
        private readonly IJobTracker jobTracker;
        private readonly IMapper mapper;
        private readonly IScheduler scheduler;

        /// <summary>
        ///     Initializes a new instance of the <see cref="JobsController"/> class.
        /// </summary>
        public JobsController(
            IJobTracker jobTracker,
            IMapper mapper,
            IScheduler scheduler)
        {
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            mapper.ShouldNotBeNull(nameof(mapper));
            scheduler.ShouldNotBeNull(nameof(scheduler));

            this.jobTracker = jobTracker;
            this.mapper = mapper;
            this.scheduler = scheduler;
        }

        /// <summary>
        ///     Creates a fake background job that never ends.
        /// </summary>
        [HttpPost("fake/in-progress/{jobTimeInMilliseconds}")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        public async Task<IActionResult> PostFakeOngoingAsync(
            int jobTimeInMilliseconds,
            [FromBody] object postBody)
        {
            var objectId = this.User?.UserClaims()?.ObjectId;
            var jobId = await this.AddJobIdToHeaderAsync(postBody.ToJson(), objectId).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    await Task.Delay(jobTimeInMilliseconds, cancellationToken).ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, objectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId(jobId)"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }

        /// <summary>
        ///     Creates a fake background job that ends in failure.
        /// </summary>
        [HttpPost("fake/failure/{jobTimeInMilliseconds}")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        public async Task<IActionResult> PostFakeFailureAsync(
            int jobTimeInMilliseconds,
            [FromBody] object postBody)
        {
            var objectId = this.User?.UserClaims()?.ObjectId;
            var jobId = await this.AddJobIdToHeaderAsync(postBody.ToJson(), objectId).ConfigureAwait(true);

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
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, objectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId(jobId)"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }

        /// <summary>
        ///     Creates a fake background job that ends in success.
        /// </summary>
        [HttpPost("fake/success/{jobTimeInMilliseconds}")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        public async Task<IActionResult> PostFakeSuccessAsync(
            int jobTimeInMilliseconds,
            [FromBody] object postBody)
        {
            var objectId = this.User?.UserClaims()?.ObjectId;
            var jobId = await this.AddJobIdToHeaderAsync(postBody.ToJson(), objectId).ConfigureAwait(true);

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
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, objectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId(jobId)"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }

        /// <summary>
        ///     Gets the background job by ID.
        /// </summary>
        [HttpGet("jobId({jobId})")]
        [SwaggerResponse(200, type: typeof(BackgroundJob))]
        public async Task<IActionResult> GetStatusAsync(string jobId)
        {
            try
            {
                jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));

                var status = await this.jobTracker.GetJobStatusAsync(jobId).ConfigureAwait(true);

                var output = this.mapper.Map<BackgroundJob>(status);

                return this.Ok(output);
            }
            catch (Exception ex)
            {
                return this.NotFound(ex);
            }
        }

        /// <summary>
        ///     Gets the background jobs for a given user.
        /// </summary>
        [HttpGet("userObjectId({userObjectId})")]
        [SwaggerResponse(200, type: typeof(IList<BackgroundJob>))]
        public async Task<IActionResult> GetJobsByUserAsync(string userObjectId, [FromQuery] string resultsFrom = null)
        {
            try
            {
                userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));

                TimeSpan? resultsFromTS = null;
                try
                {
                    if (resultsFrom != null)
                    {
                        resultsFromTS = XmlConvert.ToTimeSpan(resultsFrom);
                    }
                }
                catch (Exception ex)
                {
                    return this.BadRequest($"Provided invalid query param: \"{nameof(resultsFrom)}\" with value \"{resultsFrom}\"");
                }

                var jobs = await this.jobTracker.GetJobsByUserAsync(userObjectId, resultsFromTS).ConfigureAwait(true);

                var output = this.mapper.Map<IList<BackgroundJob>>(jobs);

                return this.Ok(output);
            }
            catch (Exception ex)
            {
                return this.NotFound(ex);
            }
        }

        private async Task<string> AddJobIdToHeaderAsync(string requestBody, string userObjectId)
        {
            var jobId = await this.jobTracker.CreateNewJobAsync(requestBody, userObjectId, "Fake Job").ConfigureAwait(true);

            this.Response.Headers.Add("jobId", jobId);

            return jobId;
        }
    }
}