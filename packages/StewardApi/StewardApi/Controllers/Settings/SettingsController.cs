using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Forte;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Settings;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles settings requests for Steward.
    /// </summary>
    [Route("api/v1/settings")]
    [ApiController]
    [Authorize]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    public sealed class SettingsController : ControllerBase
    {
        private readonly IBlobStorageProvider blobStorageProvider;
        private readonly IGeneralSettingsProvider generalSettingsProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SettingsController"/> class.
        /// </summary>
        public SettingsController(IBlobStorageProvider blobStorageProvider, IGeneralSettingsProvider generalSettingsProvider)
        {
            blobStorageProvider.ShouldNotBeNull(nameof(blobStorageProvider));
            generalSettingsProvider.ShouldNotBeNull(nameof(generalSettingsProvider));

            this.blobStorageProvider = blobStorageProvider;
            this.generalSettingsProvider = generalSettingsProvider;
        }

        /// <summary>
        ///     Gets the supported LSP endpoints.
        /// </summary>
        [HttpGet("lspEndpoints")]
        [SwaggerResponse(200, type: typeof(TitleEndpoints))]
        public IActionResult GetLspEndpoints()
        {
            var validEndpoints = this.generalSettingsProvider.GetLspEndpoints();

            return this.Ok(validEndpoints);
        }

        /// <summary>
        ///     Sets the available Steward tools.
        /// </summary>
        [HttpPost("tools/availability")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(ToolsAvailability))]
        [Authorize(Policy = UserAttributeValues.AdminFeature)]
        public async Task<IActionResult> SetToolsAvailable([FromBody] ToolsAvailability updatedToolsAvailability)
        {
            updatedToolsAvailability.ShouldNotBeNull(nameof(updatedToolsAvailability));

            var results = await this.blobStorageProvider.SetToolsAvailabilityAsync(updatedToolsAvailability).ConfigureAwait(true);

            return this.Ok(results);
        }

        /// <summary>
        ///     Sets the available Steward tools.
        /// </summary>
        [HttpPost("playfab")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
        [SwaggerResponse(200, type: typeof(StewardPlayFabSettings))]
        [Authorize(Policy = UserAttributeValues.ManagePlayFabSettings)]
        [AutoActionLogging(TitleCodeName.None, StewardAction.Update, StewardSubject.PlayFabSettings)]
        public async Task<IActionResult> SetPlayFabSettings([FromBody] StewardPlayFabSettings updatedPlayfabSettings)
        {
            updatedPlayfabSettings.ShouldNotBeNull(nameof(updatedPlayfabSettings));

            var results = await this.blobStorageProvider.SetStewardPlayFabSettingsAsync(updatedPlayfabSettings).ConfigureAwait(true);

            return this.Ok(results);
        }
    }
}
