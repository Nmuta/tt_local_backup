using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
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
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent)]
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
        [Authorize(Policy = UserAttribute.BanConsole)]
        public async Task<IActionResult> SetConsoleBanStatus(ulong consoleId, [FromBody] bool isBanned)
        {
            try
            {
                await this.Services.UserManagementService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(true);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to update console ban status. (consoleID: {consoleId}).", ex);
            }
        }
    }
}
