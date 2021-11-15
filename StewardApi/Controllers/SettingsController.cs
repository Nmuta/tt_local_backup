using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
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
    [Route("api/v1/settings")]
    [ApiController]
    [Authorize]
    public sealed class SettingsController : ControllerBase
    {
        private readonly IBlobStorageProvider blobStorageProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SettingsController"/> class.
        /// </summary>
        public SettingsController(IBlobStorageProvider blobStorageProvider)
        {
            blobStorageProvider.ShouldNotBeNull(nameof(blobStorageProvider));

            this.blobStorageProvider = blobStorageProvider;
        }

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

        /// <summary>
        ///     Sets the available Steward tools.
        /// </summary>
        [HttpPost("tools/availability")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(ToolsAvailability))]
        public async Task<IActionResult> SetToolsAvailable([FromBody] ToolsAvailability updatedToolsAvailability)
        {
            var results = await this.blobStorageProvider.SetToolsAvailability(updatedToolsAvailability).ConfigureAwait(true);

            return this.Ok(results);
        }
    }
}
