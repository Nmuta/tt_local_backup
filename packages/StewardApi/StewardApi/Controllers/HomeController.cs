using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Controller for home page and misc Health routes.
    /// </summary>
    [ApiController]
    [Tags("Misc")]
    public class HomeController : ControllerBase
    {
        private const string EnvInstanceId = "WEBSITE_INSTANCE_ID";

        /// <summary>
        ///     Produces a 200 OK response when the service has started successfully.
        /// </summary>
        [HttpGet("~/api/health")]
        [SwaggerResponse(200)]
        public IActionResult BasicHealthCheck()
        {
            return this.Ok(new
            {
                Now = DateTimeOffset.UtcNow,
                InstanceId = Environment.GetEnvironmentVariable(EnvInstanceId),
            });
        }

        /// <summary>
        ///     Produces a 200 OK response when the service has started successfully.
        /// </summary>
        [HttpGet("~/api/health/ado")]
        [SwaggerResponse(200)]
        public IActionResult AdoHealthResponse()
        {
            return this.Ok(new
            {
                Name = "TaskCompleted",
                TaskId = this.HttpContext.Request.Headers["TaskInstanceId"].SingleOrDefault(),
                JobId = this.HttpContext.Request.Headers["JobId"].SingleOrDefault(),
                InstanceId = Environment.GetEnvironmentVariable(EnvInstanceId),
                Result = "succeeded",
            });
        }

        /// <summary>
        ///     Produces a 200 OK response.
        /// </summary>
        [HttpGet("~/")]
        [SwaggerResponse(200)]
        public IActionResult Home()
        {
            return this.Ok();
        }
    }
}
