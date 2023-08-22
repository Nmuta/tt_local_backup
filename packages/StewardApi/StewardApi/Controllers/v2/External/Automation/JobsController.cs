using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Controllers.V2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Middleware.ApiKeyAuth;
using Turn10.LiveOps.StewardApi.Providers;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.External.Automation
{
    /// <summary>
    ///     Handles automation requests for checking pending Steward Jobs.
    /// </summary>
    [Route("api/v{version:apiVersion}/external/automation/jobs")]
    [RequireApiKey(StewardApiKey.StewardAutomation)]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Meta.External, Title.Agnostic, Topic.Automation)]
    public class JobsController : V2ControllerBase
    {
        private readonly IJobTracker jobTracker;

        public JobsController(IJobTracker jobTracker)
        {
            this.jobTracker = jobTracker;
        }

        /// <summary>
        ///     Produces a response for ADO guards.
        ///     When jobs are pending, produces a bad response.
        ///     When no jobs are pending, produces a good response.
        /// </summary>
        [HttpGet("verify/ado")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> GetStateForAdo()
        {
            var jobs = await this.jobTracker.GetInProgressJobsAsync();
            if (jobs.Any())
            {
                return this.BadRequest();
            }

            return this.Ok(new
            {
                Name = "TaskCompleted",
                TaskId = this.HttpContext.Request.Headers["TaskInstanceId"].SingleOrDefault(),
                JobId = this.HttpContext.Request.Headers["JobId"].SingleOrDefault(),
                Result = "succeeded",
            });
        }
    }
}
