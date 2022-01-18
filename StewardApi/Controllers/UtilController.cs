using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles settings requests for Steward.
    /// </summary>
    [Route("api/v1/util")]
    [ApiController]
    [Authorize]
    public sealed class UtilController : ControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="UtilController"/> class.
        /// </summary>
        public UtilController()
        {
        }

        /// <summary>
        ///     Returns the provided response code. Similar to httpstat.us.
        /// </summary>
        [HttpGet("status/{code}")]
        [SwaggerResponse(200)]
        public Task<IActionResult> GetStatus(
            int code,
            [FromQuery] int delay,
            [FromQuery(Name = "r")] string responseRaw)
        {
            if (string.IsNullOrWhiteSpace(responseRaw))
            {
                JObject response = JsonConvert.DeserializeObject<dynamic>(responseRaw);
                return this.StatusCodeResponse(code, delay, response);
            }

            return this.StatusCodeResponse(code, delay, null);
        }

        /// <summary>
        ///     Returns the provided response code. Similar to httpstat.us.
        /// </summary>
        [HttpGet("status/{code}")]
        [SwaggerResponse(200)]
        public Task<IActionResult> DeleteStatus(
            int code,
            [FromQuery] int delay,
            [FromQuery(Name = "r")] string responseRaw)
        {
            if (string.IsNullOrWhiteSpace(responseRaw))
            {
                JObject response = JsonConvert.DeserializeObject<dynamic>(responseRaw);
                return this.StatusCodeResponse(code, delay, response);
            }

            return this.StatusCodeResponse(code, delay, null);
        }

        /// <summary>
        ///     Returns the provided response code. Similar to httpstat.us.
        /// </summary>
        [HttpPost("status/{code}")]
        [SwaggerResponse(200)]
        public Task<IActionResult> PostStatus(int code, [FromQuery] int delay, [FromBody] JObject response)
        {
            return this.StatusCodeResponse(code, delay, response);
        }

        /// <summary>
        ///     Returns the provided response code. Similar to httpstat.us.
        /// </summary>
        [HttpPatch("status/{code}")]
        [SwaggerResponse(200)]
        public Task<IActionResult> PatchStatus(int code, [FromQuery] int delay, [FromBody] JObject response)
        {
            return this.StatusCodeResponse(code, delay, response);
        }

        /// <summary>
        ///     Returns the provided response code. Similar to httpstat.us.
        /// </summary>
        [HttpPut("status/{code}")]
        [SwaggerResponse(200)]
        public Task<IActionResult> PutStatus(int code, [FromQuery] int delay, [FromBody] JObject response)
        {
            return this.StatusCodeResponse(code, delay, response);
        }

        private async Task<IActionResult> StatusCodeResponse(int code, int delay, JObject response)
        {
            if (response == null)
            {
                await Task.Delay(delay).ConfigureAwait(true);
                return this.StatusCode(code);
            }

            var hasError = response.Properties().Select(p => p.Name).Contains("error");
            if (hasError)
            {
                if (response.Properties().Count() > 1)
                {
                    // invalid configuration so no delay
                    throw new InvalidArgumentsStewardException("If there is an 'error' property, it must be the only property");
                }

                var error = response["error"];

                if (error.GetType() == typeof(JValue))
                {
                    await Task.Delay(delay).ConfigureAwait(true);
                    throw new CustomStewardException((HttpStatusCode)code, error.ToString());
                }

                if (error.GetType() != typeof(JObject))
                {
                    // invalid configuration so no delay
                    throw new InvalidArgumentsStewardException("No error string was provided.");
                }
            }

            await Task.Delay(delay).ConfigureAwait(true);
            return this.StatusCode(code, response);
        }
    }
}
