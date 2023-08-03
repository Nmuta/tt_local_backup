using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.UGC.Contracts;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using ServicesLiveOps = Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/ugc/{ugcId}/geoFlags")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Ugc, Target.Details)]
    public class GeoFlagsController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;

        /// <summary>
        ///    Sets UGC geo flags.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Ugc)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.UgcGeoFlags)]
        [Authorize(Policy = UserAttributeValues.SetUgcGeoFlag)]
        public async Task<IActionResult> SetGeoFlags(string ugcId, [FromBody] IList<SteelheadUgcGeoFlagOption> geoFlags)
        {
            if (!Guid.TryParse(ugcId, out var parsedUgcId))
            {
                throw new BadRequestStewardException("UGC ID could not be parsed as GUID.");
            }

            if (geoFlags == null)
            {
                throw new BadRequestStewardException($"Missing geo-flags.");
            }

            try
            {
                var typedGeoFlags = geoFlags.Cast<int>().ToArray();
                await this.Services.StorefrontManagementService.SetUGCGeoFlag(parsedUgcId, typedGeoFlags).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to set UGC geo flags. (ugcId: {parsedUgcId}) (geoFlags: {geoFlags})", ex);
            }

            return this.Ok();
        }
    }
}
