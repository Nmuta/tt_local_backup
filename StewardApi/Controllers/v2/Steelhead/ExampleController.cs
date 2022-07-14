using System;
using System.Linq;
using System.Threading.Tasks;
using Forza.LiveOps.FM8.Generated;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Controllers.v2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/example/")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags("Inventory", "Steelhead", "InDev")]
    public class ExampleController : V2ControllerBase
    {
        /// <summary>
        ///     Gets inventory for given steelhead user.
        /// </summary>
        [HttpGet("xuid/{xuid}/inventory")]
        [SwaggerResponse(200, type: typeof(AdminForzaUserInventorySummary))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GetInventory(ulong xuid)
        {
            var services = this.SteelheadServices.Value;
            var x = await services.OldUserInventoryManagementService.GetAdminUserInventory(xuid).ConfigureAwait(true);

            return this.Ok(x.summary);
        }
    }
}
