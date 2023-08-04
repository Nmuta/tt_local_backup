using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for steelhead consoles.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/console/{consoleId}")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Consoles, Target.Details, Dev.ReviseTags)]
    public class ConsoleController : V2SteelheadControllerBase
    {
        /// <summary>
        ///     Set console ban status for Steelhead.
        /// </summary>
        [HttpPut("banStatus")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Console, ActionAreaLogTags.Banning)]
        [Authorize(Policy = UserAttributeValues.BanConsole)]
        public async Task<IActionResult> SetConsoleBanStatus(ulong consoleId, [FromBody] bool isBanned)
        {
            await this.Services.UserManagementService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
