using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FM8.Generated;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Steelhead
{
    /// <summary>
    ///     Controller for steelhead consoles.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/console")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags("Console", "Steelhead", "InDev")]
    public class ConsoleController : V2SteelheadControllerBase
    {
        /// <summary>
        ///     Set console ban status for Steelhead.
        /// </summary>
        [HttpPut("banStatus")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Console, ActionAreaLogTags.Banning)]
        public async Task<IActionResult> SetConsoleBanStatus(ulong consoleId, bool isBanned)
        {
            try
            {
                await this.Services.UserManagementService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(true);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No console found for Console ID: {consoleId}.", ex);
            }
        }
    }
}
