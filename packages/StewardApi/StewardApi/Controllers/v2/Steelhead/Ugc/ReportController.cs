using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead Ugc reporting.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/ugc")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Ugc, Target.Details)]
    public class ReportController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;

        /// <summary>
        ///    Report a ugc item.
        /// </summary>
        [HttpPost("{ugcId}/report")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Ugc)]
        [AutoActionLogging(CodeName, StewardAction.Add, StewardSubject.UgcReport)]
        [Authorize(Policy = UserAttributeValues.ReportUgc)]
        public async Task<IActionResult> ReportUgc(string ugcId)
        {
            if (!Guid.TryParse(ugcId, out var parsedUgcId))
            {
                throw new BadRequestStewardException($"UGC ID could not be parsed as GUID. (ugcId: {ugcId})");
            }

            await this.Services.StorefrontManagementService.ReportContentWithReason(parsedUgcId, Guid.NewGuid()).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
