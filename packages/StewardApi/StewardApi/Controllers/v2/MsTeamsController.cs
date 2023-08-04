using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.MsTeams;
using Turn10.LiveOps.StewardApi.Controllers.V2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.MsGraph;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2
{
    /// <summary>
    ///     Handles requests for Steward users.
    /// </summary>
    [Route("api/v{version:apiVersion}/msTeams")]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Agnostic)]
    public sealed class MsTeamsController : V2ControllerBase
    {

        private readonly IMsTeamsService msTeamsService;
        private readonly IMsGraphService graphService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MsTeamsController"/> class.
        /// </summary>
        public MsTeamsController(IMsTeamsService msTeamsService, IMsGraphService graphService)
        {
            msTeamsService.ShouldNotBeNull(nameof(msTeamsService));
            graphService.ShouldNotBeNull(nameof(graphService));

            this.msTeamsService = msTeamsService;
            this.graphService = graphService;
        }

        /// <summary>
        ///     Create bug report on MS Teams.
        /// </summary>
        [HttpPost("bugReport")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> CreateMsTeamsBugReportAsync([FromBody] MsTeamsBugReport bugReport)
        {
            var user = this.User.UserClaims();
            await this.msTeamsService.SendHelpChannelMessageAsync(bugReport.ToMsTeamsAdaptiveCardJson(user)).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///    Create feature request on MS Teams.
        /// </summary>
        [HttpPost("featureRequest")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> CreateMsTeamsFeatureRequestAsync([FromBody] MsTeamsFeatureRequest featureRequest)
        {
            var user = this.User.UserClaims();
            await this.msTeamsService.SendHelpChannelMessageAsync(featureRequest.ToMsTeamsAdaptiveCardJson(user)).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///    Create permission request on MS Teams.
        /// </summary>
        [HttpPost("permissionRequest")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> CreateMsTeamsPermissionRequestAsync([FromBody] MsTeamsPermissionRequest permissionRequest)
        {
            var user = this.User.UserClaims();
            await this.msTeamsService.SendHelpChannelMessageAsync(permissionRequest.ToMsTeamsAdaptiveCardJson(user)).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///    Create question on MS Teams.
        /// </summary>
        [HttpPost("question")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> CreateMsTeamsQuestionAsync([FromBody] MsTeamsQuestion question)
        {
            var user = this.User.UserClaims();
            await this.msTeamsService.SendHelpChannelMessageAsync(question.ToMsTeamsAdaptiveCardJson(user)).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
