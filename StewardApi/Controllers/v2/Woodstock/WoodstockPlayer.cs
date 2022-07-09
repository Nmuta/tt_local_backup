using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/player/{xuid}")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.HorizonDesigner,
        UserRole.MotorsportDesigner,
        UserRole.MediaTeam)]
    [ApiVersion("2.0")]
    [Tags("Player", "Woodstock")]
    public class WoodstockPlayer : V2ControllerBase
    {
        private readonly IWoodstockPlayerDetailsProvider playerDetailsProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockPlayer"/> class.
        /// </summary>
        public WoodstockPlayer(IWoodstockPlayerDetailsProvider playerDetailsProvider, IMapper mapper)
        {
            playerDetailsProvider.ShouldNotBeNull(nameof(playerDetailsProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.playerDetailsProvider = playerDetailsProvider;
            this.mapper = mapper;
        }

        /// <summary>
        ///    Gets a player's report weight.
        /// </summary>
        [HttpGet("reportWeight")]
        [SwaggerResponse(200, type: typeof(int))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetUserReportWeight(ulong xuid)
        {
            xuid.IsValidXuid();

            var reportWeight = await this.playerDetailsProvider.GetUserReportWeightAsync(xuid, this.WoodstockEndpoint.Value).ConfigureAwait(true);
            return this.Ok(reportWeight);
        }

        /// <summary>
        ///    Sets a player's report weight.
        /// </summary>
        [HttpPost("reportWeight")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.Player)]
        public async Task<IActionResult> SetUserReportWeight(ulong xuid, [FromBody] int reportWeight)
        {
            xuid.IsValidXuid();

            await this.playerDetailsProvider.SetUserReportWeightAsync(xuid, reportWeight, this.WoodstockEndpoint.Value).ConfigureAwait(true);
            return this.Ok();
        }

        /// <summary>
        ///    Gets a player's record of titles played.
        /// </summary>
        [HttpGet("hasPlayedRecord")]
        [SwaggerResponse(200, type: typeof(IList<HasPlayedRecord>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetHasPlayedRecord(ulong xuid, string externalProfileId)
        {
            externalProfileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(externalProfileId));
            xuid.IsValidXuid();

            if (!Guid.TryParse(externalProfileId, out var externalProfileIdGuid))
            {
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: {externalProfileId}");
            }

            var hasPlayedRecord = await this.playerDetailsProvider.GetHasPlayedRecordAsync(xuid, externalProfileIdGuid, this.WoodstockEndpoint.Value).ConfigureAwait(true);

            return this.Ok(hasPlayedRecord);
        }

        /// <summary>
        ///    Sends Loyalty Rewards for selected titles.
        /// </summary>
        [HttpPost("loyaltyRewards/send")]
        [SwaggerResponse(200)]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.CommunityManager)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.Player)]
        public async Task<IActionResult> ResendLoyaltyRewards(ulong xuid, string externalProfileId, [FromBody] string[] gameTitles)
        {
            xuid.IsValidXuid();
            externalProfileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(externalProfileId));
            gameTitles.ShouldNotBeNull(nameof(gameTitles));

            if (!Guid.TryParse(externalProfileId, out var externalProfileIdGuid))
            {
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: {externalProfileId}");
            }

            var gameTitleIds = new List<int>();
            var unparsedGameTitles = new StringBuilder();

            foreach (var gameTitle in gameTitles)
            {
                if (!Enum.TryParse(typeof(Turn10.UGC.Contracts.GameTitle), gameTitle, true, out var gameTitleEnum))
                {
                    unparsedGameTitles.Append(gameTitle);
                }
                else
                {
                    gameTitleIds.Add((int)gameTitleEnum);
                }
            }

            if (unparsedGameTitles.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Game titles: {unparsedGameTitles} were not found.");
            }

            await this.playerDetailsProvider.ResendProfileHasPlayedNotificationAsync(xuid, externalProfileIdGuid, gameTitleIds, this.WoodstockEndpoint.Value).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
