using System.Threading.Tasks;
using AutoMapper;
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
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Player
{
    /// <summary>
    ///     Handles requests for Woodstock.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/player/{xuid}/reportWeight")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Player, Topic.ReportWeight)]
    public class ReportWeightController : V2ControllerBase
    {
        private readonly IWoodstockPlayerDetailsProvider playerDetailsProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ReportWeightController"/> class.
        /// </summary>
        public ReportWeightController(IWoodstockPlayerDetailsProvider playerDetailsProvider, IMapper mapper)
        {
            playerDetailsProvider.ShouldNotBeNull(nameof(playerDetailsProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.playerDetailsProvider = playerDetailsProvider;
            this.mapper = mapper;
        }

        /// <summary>
        ///    Gets a player's report weight.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(UserReportWeight))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetUserReportWeight(ulong xuid)
        {
            ////xuid.IsValidXuid();

            var reportWeight = await this.playerDetailsProvider.GetUserReportWeightAsync(xuid, this.WoodstockEndpoint.Value).ConfigureAwait(true);
            return this.Ok(reportWeight);
        }

        /// <summary>
        ///    Sets a player's report weight.
        /// </summary>
        [HttpPost]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(UserReportWeight))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.Player)]
        [Authorize(Policy = UserAttributeValues.SetReportWeight)]
        public async Task<IActionResult> SetUserReportWeight(ulong xuid, [FromBody] UserReportWeightType reportWeightType)
        {
            xuid.IsValidXuid();

            await this.playerDetailsProvider.SetUserReportWeightAsync(xuid, reportWeightType, this.WoodstockEndpoint.Value).ConfigureAwait(true);

            var reportWeight = await this.playerDetailsProvider.GetUserReportWeightAsync(xuid, this.WoodstockEndpoint.Value).ConfigureAwait(true);
            return this.Ok(reportWeight);
        }
    }
}
