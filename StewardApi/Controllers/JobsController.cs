using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers;

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

        /// <summary>
        ///     Initializes a new instance of the <see cref="JobsController"/> class.
        /// </summary>
        public JobsController(IJobTracker jobTracker, IMapper mapper)
        {
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.jobTracker = jobTracker;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the background job.
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
        ///     Gets background jobs by object ID.
        /// </summary>
        [HttpGet("userId({userId})")]
        [SwaggerResponse(200, type: typeof(IList<BackgroundJob>))]
        public async Task<IActionResult> GetJobsByUserAsync(string userId)
        {
            try
            {
                userId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userId));

                var jobs = await this.jobTracker.GetJobsByUserAsync(userId).ConfigureAwait(true);

                var output = this.mapper.Map<IList<BackgroundJob>>(jobs);

                return this.Ok(output);
            }
            catch (Exception ex)
            {
                return this.NotFound(ex);
            }
        }
    }
}