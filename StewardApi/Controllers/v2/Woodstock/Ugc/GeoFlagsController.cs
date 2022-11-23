using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Ugc
{
    /// <summary>
    ///     Handles GeoFlags requests for Woodstock.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/ugc/{id}/geoflags")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags("UGC", "Woodstock")]
    public class GeoFlagsController : V2ControllerBase
    {
        private readonly IWoodstockStorefrontProvider storefrontProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GeoFlagsController"/> class.
        /// </summary>
        public GeoFlagsController(IWoodstockStorefrontProvider storefrontProvider)
        {
            storefrontProvider.ShouldNotBeNull(nameof(storefrontProvider));

            this.storefrontProvider = storefrontProvider;
        }

        /// <summary>
        ///    Set GeoFlags for a specific UGC Item.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.UgcItem, ActionAreaLogTags.Action | ActionAreaLogTags.Ugc)]
        [Authorize(Policy = UserAttribute.SetUgcGeoFlag)]
        public async Task<IActionResult> Post(string id, [FromBody] List<WoodstockUgcGeoFlagOption> geoFlags)
        {
            if (!Guid.TryParse(id, out var ugcId))
            {
                throw new BadRequestStewardException($"'{id}' was not parseable as a GUID.");
            }

            if (geoFlags == null)
            {
                throw new BadRequestStewardException($"Missing geo-flags.");
            }

            var typedGeoFlags = geoFlags.Cast<int>().ToArray();

            var storefront = this.WoodstockServices.Value.Storefront;
            await storefront.SetUGCGeoFlag(ugcId, typedGeoFlags).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
