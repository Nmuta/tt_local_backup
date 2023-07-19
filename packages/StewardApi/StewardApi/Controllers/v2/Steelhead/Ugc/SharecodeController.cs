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
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Validation;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Ugc
{
    /// <summary>
    ///     Manage sharecodes for Steelhead UGC.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/ugc/{type}/{id}/sharecode")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Ugc, Target.Details)]
    public class SharecodeController : V2SteelheadControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="SharecodeController"/> class.
        /// </summary>
        public SharecodeController()
        {
        }

        /// <summary>
        ///    Generate sharecode for UGC identified by UGC ID.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(GenerateSharecodeResponse))]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.UgcItem, ActionAreaLogTags.Action | ActionAreaLogTags.Ugc)]
        [AutoActionLogging(TitleCodeName.Steelhead, StewardAction.Update, StewardSubject.UserGeneratedContent)]
        public async Task<IActionResult> GenerateSharecode(string id, UgcType type)
        {
            var ugcId = id.TryParseGuidElseThrow(nameof(id));

            var lookup = await this.WoodstockServices.Value.StorefrontManagementService.GetUGCObject(ugcId).ConfigureAwait(true);
            var ugcIsPublic = lookup.result.Metadata.Searchable;
            var existingSharecode = lookup.result.Metadata.ShareCode;

            if (!ugcIsPublic)
            {
                throw new FailedToSendStewardException("Cannot assign sharecode to private UGC.");
            }

            if (!string.IsNullOrWhiteSpace(existingSharecode))
            {
                var existingResponse = new GenerateSharecodeResponse { Sharecode = existingSharecode };
                return this.Ok(existingResponse);
            }

            var result = await this.SteelheadServices.Value.StorefrontManagementService.GenerateShareCode(ugcId).ConfigureAwait(true);
            var response = new GenerateSharecodeResponse { Sharecode = result.shareCode };

            return this.Ok(response);
        }
    }
}
