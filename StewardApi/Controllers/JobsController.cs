using System;
using System.Threading.Tasks;
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
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public sealed class JobsController : ControllerBase
    {
        private readonly IJobTracker jobTracker;

        /// <summary>
        ///     Initializes a new instance of the <see cref="JobsController"/> class.
        /// </summary>
        /// <param name="jobTracker">The job tracker.</param>
        public JobsController(IJobTracker jobTracker)
        {
            jobTracker.ShouldNotBeNull(nameof(jobTracker));

            this.jobTracker = jobTracker;
        }

        /// <summary>
        ///     Gets the status.
        /// </summary>
        /// <param name="jobId">The job ID.</param>
        /// <returns>
        ///     200 OK if successful.
        ///     The status.
        /// </returns>
        [HttpGet("{jobId}")]
        [SwaggerResponse(200, type: typeof(BackgroundJobStatus))]
        public async Task<IActionResult> GetStatusAsync(string jobId)
        {
            try
            {
                jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));

                var status = await this.jobTracker.GetJobStatusAsync(jobId).ConfigureAwait(true);

                return this.Ok(status);
            }
            catch (Exception ex)
            {
                return this.NotFound(ex);
            }
        }
    }
}