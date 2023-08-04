using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/cmsOverride")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [DangerousTags(Title.Steelhead, Target.Player, Topic.CmsOverride)]

    public class CmsOverrideController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;

        /// <summary>
        ///     Gets player CMS override.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(ForzaCMSOverride))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        public async Task<IActionResult> GetPlayerCmsOverride(
            ulong xuid)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            var response = await this.Services.UserManagementService.GetCMSOverride(xuid).ConfigureAwait(true);

            return this.Ok(response.cmsOverride);
        }

        /// <summary>
        ///     Sets player CMS override.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.CmsOverride)]
        [Authorize(Policy = UserAttributeValues.OverrideCms)]
        public async Task<IActionResult> SetPlayerCmsOverride(
            ulong xuid,
            [FromBody] ForzaCMSOverride cmsOverride)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            await this.Services.UserManagementService.SetCMSOverride(
                    xuid,
                    cmsOverride.Snapshot,
                    cmsOverride.Environment,
                    cmsOverride.Slot).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Removes a player CMS override.
        /// </summary>
        [HttpDelete]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.CmsOverride)]
        [Authorize(Policy = UserAttributeValues.OverrideCms)]
        public async Task<IActionResult> DeletePlayerCmsOverride(ulong xuid)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            await this.Services.UserManagementService.DeleteCMSOverride(xuid).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
