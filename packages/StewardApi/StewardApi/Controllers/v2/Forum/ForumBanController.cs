using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Data;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Forum
{
    /// <summary>
    ///     Forum ban controller.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/forum/players/ban")]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Agnostic, Target.Player, Topic.Banning)]
    public class ForumBanController : V2ControllerBase
    {
        private readonly IForumBanHistoryProvider forumBanHistoryProvider;
        private readonly IForumBanHistoryProvider banHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ForumBanController"/> class.
        /// </summary>
        public ForumBanController(IForumBanHistoryProvider forumBanHistoryProvider, IForumBanHistoryProvider banHistoryProvider)
        {
            forumBanHistoryProvider.ShouldNotBeNull(nameof(forumBanHistoryProvider));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));

            this.forumBanHistoryProvider = forumBanHistoryProvider;
            this.banHistoryProvider = banHistoryProvider;
        }

        /// <summary>
        ///     Record forum bans.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Create | ActionAreaLogTags.Banning)]
        [AutoActionLogging(TitleCodeName.None, StewardAction.Add, StewardSubject.Ban)]
        [Authorize(Policy = UserAttributeValues.BanPlayer)]
        public async Task<IActionResult> ForumBanPlayers(
            [FromBody] IList<ForumBanParametersInput> banInput)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            banInput.ShouldNotBeNull(nameof(banInput));

            foreach (var ban in banInput)
            {
                await this.forumBanHistoryProvider.CreateForumBanHistoryAsync(
                                        ban.Xuid.Value,
                                        ban,
                                        requesterObjectId).ConfigureAwait(false);
            }

            return this.Ok();
        }

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        [HttpPost("banSummaries")]
        [SwaggerResponse(200, type: typeof(IList<BanSummary>))]
        [LogTagDependency(DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Banning)]
        public async Task<IActionResult> GetBanSummaries([FromBody] IList<ulong> xuids)
        {
            xuids.ShouldNotBeNull(nameof(xuids));

            var result = await this.banHistoryProvider.GetUserBanSummariesAsync(xuids).ConfigureAwait(true);

            return this.Ok(result);
        }
    }
}
