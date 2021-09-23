using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles settings requests for Steward.
    /// </summary>
    [Route("api/v1/settings")]
    [ApiController]
    [Authorize]
    public sealed class SettingsController : ControllerBase
    {
        /// <summary>
        ///     Gets the supported LSP endpoints.
        /// </summary>
        [HttpGet("lspEndpoints")]
        [SwaggerResponse(200, type: typeof(TitleEndpoints))]
        public IActionResult GetLspEndpoints()
        {
            var validEndpoints = new TitleEndpoints
            {
                Apollo = typeof(ApolloEndpoint).GetProperties().Select(p => new LspEndpoint(p.Name)),
                Sunrise = typeof(SunriseEndpoint).GetProperties().Select(p => new LspEndpoint(p.Name)),
                Woodstock = typeof(WoodstockEndpoint).GetProperties().Select(p => new LspEndpoint(p.Name)),
                Steelhead = typeof(SteelheadEndpoint).GetProperties().Select(p => new LspEndpoint(p.Name)),
            };

            return this.Ok(validEndpoints);
        }

    }
}
