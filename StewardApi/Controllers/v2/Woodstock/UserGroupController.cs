using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.UserGroup
{
    /// <summary>
    ///     Handles requests for Woodstock user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/usergroup")]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags("UserGroup", "Woodstock")]
    public class UserGroupController : V2ControllerBase
    {
        private readonly IWoodstockServiceManagementProvider serviceManagementProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UserGroupController"/> class.
        /// </summary>
        public UserGroupController(IWoodstockServiceManagementProvider serviceManagementProvider)
        {
            serviceManagementProvider.ShouldNotBeNull(nameof(serviceManagementProvider));

            this.serviceManagementProvider = serviceManagementProvider;
        }

        /// <summary>
        ///    Create user group.
        /// </summary>
        [HttpPost("{userGroupName}")]
        [SwaggerResponse(200, type: typeof(LspGroup))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Create)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Add, StewardSubject.UserGroup)]
        public async Task<IActionResult> CreateUserGroup(string userGroupName)
        {
            userGroupName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userGroupName));

            var endpoint = this.WoodstockEndpoint.Value;
            var newGroup = await this.serviceManagementProvider.CreateLspGroupAsync(userGroupName, endpoint).ConfigureAwait(false);

            return this.Ok(newGroup);
        }

        /// <summary>
        ///    Add users to a user group.
        /// </summary>
        [HttpPost("{userGroupId}/add")]
        [SwaggerResponse(200, type: typeof(IList<int>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.UserGroup)]
        public async Task<IActionResult> AddUsersToGroup(int userGroupId, [FromBody] IList<ulong> xuids)
        {
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));
            xuids.EnsureValidXuids();

            var endpoint = this.WoodstockEndpoint.Value;
            var response = await this.serviceManagementProvider.AddUsersToLspGroupAsync(xuids, userGroupId, endpoint).ConfigureAwait(false);

            return this.Ok(response);
        }

        /// <summary>
        ///    Remove users from a user group.
        /// </summary>
        [HttpPost("{userGroupId}/remove")]
        [SwaggerResponse(200, type: typeof(IList<int>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.UserGroup)]
        public async Task<IActionResult> RemoveUsersFromGroup(int userGroupId, [FromBody] IList<ulong> xuids)
        {
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));
            xuids.EnsureValidXuids();

            var endpoint = this.WoodstockEndpoint.Value;
            var response = await this.serviceManagementProvider.RemoveUsersFromLspGroupAsync(xuids, userGroupId, endpoint).ConfigureAwait(false);

            return this.Ok(response);
        }
    }
}
