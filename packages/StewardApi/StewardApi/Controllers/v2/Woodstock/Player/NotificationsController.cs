using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Player
{
    /// <summary>
    ///     Handles requests for Woodstock items.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/player/{xuid}/notifications")]
    [ApiVersion("2.0")]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [SuppressMessage(
        "Microsoft.Maintainability",
        "CA1506:AvoidExcessiveClassCoupling",
        Justification = "This can't be avoided.")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [DangerousTags(Title.Woodstock, Target.Player, Topic.Messaging)]
    public sealed class NotificationsController : V2WoodstockControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        /// <summary>
        ///     Deletes all of a user's notifications.
        /// </summary>
        [HttpDelete]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.DeleteAll, StewardSubject.PlayerMessages)]
        [Authorize(Policy = UserAttributeValues.AdminFeature)]
        public async Task<IActionResult> DeleteAllPlayerNotifications(ulong xuid)
        {
            xuid.EnsureValidXuid();

            await this.Services.NotificationsManagementService.DeleteNotificationsForUser(xuid).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
