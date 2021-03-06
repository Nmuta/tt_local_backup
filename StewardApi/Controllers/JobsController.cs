using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
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
        /// <param name="jobTracker">The job tracker.</param>
        /// <param name="mapper">The mapper.</param>
        public JobsController(IJobTracker jobTracker, IMapper mapper)
        {
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.jobTracker = jobTracker;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the background job..
        /// </summary>
        /// <param name="jobId">The job ID.</param>
        /// <returns>
        ///     A <see cref="BackgroundJob"/>.
        /// </returns>
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
    }
}