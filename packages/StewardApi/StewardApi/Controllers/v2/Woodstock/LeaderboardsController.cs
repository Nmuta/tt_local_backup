using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Forza.Scoreboard.FH5_main.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10;
using Turn10.Data.Common;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Controllers.v2;
using Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock auctions.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/leaderboards")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock)]
    public sealed class LeaderboardsController : V2WoodstockControllerBase
    {
        private readonly IWoodstockLeaderboardProvider leaderboardProvider;
        private readonly IActionLogger actionLogger;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LeaderboardsController"/> class.
        /// </summary>
        public LeaderboardsController(IWoodstockLeaderboardProvider leaderboardProvider, IActionLogger actionLogger)
        {
            leaderboardProvider.ShouldNotBeNull(nameof(leaderboardProvider));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));

            this.leaderboardProvider = leaderboardProvider;
            this.actionLogger = actionLogger;
        }

        /// <summary>
        ///     Gets the leaderboards.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IEnumerable<Leaderboard>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Leaderboards)]
        public async Task<IActionResult> GetLeaderboards([FromQuery] string pegasusEnvironment = null)
        {
            var environment = WoodstockPegasusEnvironment.RetrieveEnvironment(pegasusEnvironment);

            var leaderboards = await this.leaderboardProvider.GetLeaderboardsAsync(environment).ConfigureAwait(true);

            return this.Ok(leaderboards);
        }
    }
}
