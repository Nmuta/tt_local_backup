using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Controllers.V2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/groups")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [Authorize]
    [ApiVersion("2.0")]
    [Tags("Steelhead", "Groups")]
    public class GroupsController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;

        private readonly ISteelheadServiceManagementProvider serviceManagementProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GroupsController"/> class.
        /// </summary>
        public GroupsController(ISteelheadServiceManagementProvider serviceManagementProvider)
        {
            serviceManagementProvider.ShouldNotBeNull(nameof(serviceManagementProvider));

            this.serviceManagementProvider = serviceManagementProvider;
        }

        /// <summary>
        ///     Gets all user groups.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<LspGroup>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GeAllUserGroups()
        {
            var groups = await this.serviceManagementProvider.GetUserGroupsAsync(this.Services).ConfigureAwait(true);

            return this.Ok(groups);
        }
    }
}
