using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock leaderboard talent.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/leaderboard/talent")]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.LspGroup, Topic.LspGroups)]
    public class LeaderboardTalentController : V2WoodstockControllerBase
    {
        private readonly int leaderboardTalentGroupId = 14;
        private readonly int maxResults = 500;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LeaderboardTalentController"/> class for Steelhead.
        /// </summary>
        public LeaderboardTalentController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Retrieves talented leaderboard players.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<IdentityResultAlpha>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetLeaderboardTalent()
        {
            UserManagementService.GetUserGroupUsersOutput leaderboardTalent = null;
            UserManagementService.GetUserIdsOutput result = null;

            leaderboardTalent = await this.Services.UserManagementService.GetUserGroupUsers(this.leaderboardTalentGroupId, 0, this.maxResults).ConfigureAwait(true);

            var convertedQueries = this.mapper.SafeMap<ForzaPlayerLookupParameters[]>(leaderboardTalent.xuids);

            result = await this.Services.UserManagementService.GetUserIds(convertedQueries.Length, convertedQueries).ConfigureAwait(true);

            var identityResults = this.mapper.SafeMap<IList<IdentityResultAlpha>>(result.playerLookupResult);
            identityResults.SetErrorsForInvalidXuids();

            return this.Ok(identityResults.Where(x => x.Error == null));
        }
    }
}
