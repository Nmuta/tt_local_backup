using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Retrieves common slots for Steelhead pegasus
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/pegasus/slots")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.Pegasus)]
    public class PegasusSlotController : V2SteelheadControllerBase
    {
        private readonly List<string> commonSlots = new List<string> { "live", "daily", "playtest" };

        /// <summary>
        ///    Gets pegasus slots for a given environment.
        /// </summary>
        /// <param name="environment">
        ///     Unused currently, for use when we have an API to lookup Pegasus slots based on environment.
        /// </param>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<string>))]
        public IActionResult GetPegasusSlots([FromQuery] string environment)
        {
            return this.Ok(this.commonSlots);
        }
    }
}
