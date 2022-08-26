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
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Player
{
    /// <summary>
    ///     Handles requests for Woodstock.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/player/{xuid}/loyaltyRewards/")]
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
    [Tags(Title.Woodstock, Target.Player, Topic.LoyaltyRewards)]
    public class LoyaltyRewardsController : V2WoodstockControllerBase
    {
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LoyaltyRewardsController"/> class.
        /// </summary>
        public LoyaltyRewardsController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
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
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: (externalProfileId: {externalProfileId})");
            }

            UserManagementService.GetHasPlayedRecordOutput response;
            try
            {
                response = await this.Services.UserManagementService.GetHasPlayedRecord(xuid, externalProfileIdGuid).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Has played record not found. (XUID: {xuid}) (externalProfileId: {externalProfileIdGuid})", ex);
            }

            var hasPlayedRecord = this.mapper.SafeMap<IList<HasPlayedRecord>>(response.records);

            return this.Ok(hasPlayedRecord);
        }

        /// <summary>
        ///    Sends Loyalty Rewards for selected titles.
        /// </summary>
        [HttpPost("send")]
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
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: (externalProfileId: {externalProfileId})");
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

            try
            {
                await this.Services.UserManagementService.ResendProfileHasPlayedNotification(xuid, externalProfileIdGuid, gameTitleIds.ToArray()).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to resend loyalty rewards. (XUID: {xuid}) (externalProfileId: {externalProfileIdGuid}) (gameTitles: {gameTitleIds.ToString()})", ex);
            }

            return this.Ok();
        }
    }
}
