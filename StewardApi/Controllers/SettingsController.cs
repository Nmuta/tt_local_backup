using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;

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
                Apollo = typeof(ApolloEndpoint).GetProperties()
                    .Where(p => p.GetValue(p.Name) != null).Select(p => new LspEndpoint(p.Name)),
                Sunrise = typeof(SunriseEndpoint).GetProperties()
                    .Where(p => p.GetValue(p.Name) != null).Select(p => new LspEndpoint(p.Name)),
                Woodstock = typeof(WoodstockEndpoint).GetProperties()
                    .Where(p => p.GetValue(p.Name) != null).Select(p => new LspEndpoint(p.Name)),
                Steelhead = typeof(SteelheadEndpoint).GetProperties()
                    .Where(p => p.GetValue(p.Name) != null).Select(p => new LspEndpoint(p.Name)),
            };

            if (this.User.UserClaims().Role == UserRole.LiveOpsAdmin)
            {
                return this.Ok(validEndpoints);
            }

            validEndpoints.Apollo = validEndpoints.Apollo.Where(endpoint => endpoint.Name != nameof(ApolloEndpoint.Studio));
            validEndpoints.Sunrise = validEndpoints.Sunrise.Where(endpoint => endpoint.Name != nameof(SunriseEndpoint.Studio));
            validEndpoints.Woodstock = validEndpoints.Woodstock.Where(endpoint => endpoint.Name != nameof(WoodstockEndpoint.Studio));
            validEndpoints.Steelhead = validEndpoints.Steelhead.Where(endpoint => endpoint.Name != nameof(SteelheadEndpoint.Studio));

            return this.Ok(validEndpoints);
        }
    }
}
