using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Data;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Forum
{
    /// <summary>
    ///     Forum ban history controller.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/forum/player/{xuid}/banHistory")]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Agnostic, Target.Player, Topic.BanHistory)]
    public class ForumBanHistoryController : V2ControllerBase
    {
        private readonly IForumBanHistoryProvider banHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ForumBanHistoryController"/> class.
        /// </summary>
        public ForumBanHistoryController(IForumBanHistoryProvider banHistoryProvider)
        {
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));

            this.banHistoryProvider = banHistoryProvider;
        }

        /// <summary>
        ///     Gets forum ban history.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<LiveOpsBanHistory>))]
        [LogTagDependency(DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Banning)]
        public async Task<IActionResult> GetForumBanHistory(
            ulong xuid)
        {
            var result = await this.banHistoryProvider.GetForumBanHistoriesAsync(xuid)
            .ConfigureAwait(true);

            return this.Ok(result);
        }
    }
}
