using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for Woodstock items.
    /// </summary>
    [Route("api/v1/title/woodstock/player/{xuid}")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.MediaTeam,
        UserRole.MotorsportDesigner,
        UserRole.HorizonDesigner)]
    [SuppressMessage(
        "Microsoft.Maintainability",
        "CA1506:AvoidExcessiveClassCoupling",
        Justification = "This can't be avoided.")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    public sealed class WoodstockPlayerController : ControllerBase
    {
        private const string DefaultEndpointKey = "Woodstock|Retail";
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        private readonly IWoodstockNotificationProvider notificationProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockPlayerController"/> class.
        /// </summary>
        public WoodstockPlayerController(IWoodstockNotificationProvider notificationProvider)
        {
            notificationProvider.ShouldNotBeNull(nameof(notificationProvider));

            this.notificationProvider = notificationProvider;
        }

        /// <summary>
        ///     Deletes all of a user's notifications.
        /// </summary>
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [HttpDelete("notifications")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.DeleteAll, StewardSubject.PlayerMessages)]
        [Authorize(Policy = UserAttribute.MessagePlayer)]
        public async Task<IActionResult> DeleteAllNotifications(ulong xuid)
        {
            xuid.EnsureValidXuid();

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            await this.notificationProvider.DeleteAllUserNotificationsAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok();
        }
    }
}
