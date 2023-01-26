using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PlayFab.MultiplayerModels;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock PlayFab integrations..
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/playfab")]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock)]
    public class PlayFabController : V2WoodstockControllerBase
    {
        private readonly IWoodstockPlayFabService playFabService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PlayFabController"/> class for Steelhead.
        /// </summary>
        public PlayFabController(IWoodstockPlayFabService playFabService)
        {
            playFabService.ShouldNotBeNull(nameof(playFabService));

            this.playFabService = playFabService;
        }

        /// <summary>
        ///     Retrieves talented leaderboard players.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<BuildSummary>))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        public async Task<IActionResult> GetPlayFabBuild([FromQuery] string playFabEnvironment = "Dev")
        {
            if (!Enum.TryParse(playFabEnvironment, out WoodstockPlayFabEnvironment parsedPlayFabEnvironment))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(WoodstockPlayFabEnvironment)} provided: {playFabEnvironment}");
            }

            try
            {
                var builds = await this.playFabService.GetBuildsAsync(parsedPlayFabEnvironment).ConfigureAwait(true);
                return this.Ok(builds);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get multiplayer service builds from PlayFab.", ex);
            }
        }
    }
}
