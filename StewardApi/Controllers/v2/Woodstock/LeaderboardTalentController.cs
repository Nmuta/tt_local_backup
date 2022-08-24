using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static System.FormattableString;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock leaderboard talent.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/leaderboard/talent")]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags("UserGroup", "Woodstock")]
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
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager,
            UserRole.HorizonDesigner)]
        [SwaggerResponse(200, type: typeof(IList<IdentityResultAlpha>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetLeaderboardTalent()
        {
            try
            {
                var leaderboardTalent = await this.Services.UserManagementService.GetUserGroupUsers(this.leaderboardTalentGroupId, 0, this.maxResults).ConfigureAwait(true);

                var convertedQueries = this.mapper.Map<ForzaPlayerLookupParameters[]>(leaderboardTalent.xuids);

                var result = await this.Services.UserManagementService.GetUserIds(convertedQueries.Length, convertedQueries).ConfigureAwait(true);

                var identityResults = this.mapper.Map<IList<IdentityResultAlpha>>(result.playerLookupResult);
                identityResults.SetErrorsForInvalidXuids();

                return this.Ok(identityResults.Where(x => x.Error == null));
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to lookup users in leaderboard talent user group. (userGroupId: {this.leaderboardTalentGroupId})", ex);
            }
        }
    }
}
