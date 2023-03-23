using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Player
{
    /// <summary>
    ///     Handles requests for Woodstock.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/player/{xuid}/loyalty/")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.HorizonDesigner,
        UserRole.MotorsportDesigner,
        UserRole.MediaTeam)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Player, Topic.LoyaltyRewards)]
    public class LoyaltyRewardsController : V2WoodstockControllerBase
    {
        private readonly IMapper mapper;
        private readonly ILoggingService loggingService;

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
        [HttpGet]
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
        [HttpPost]
        [SwaggerResponse(200)]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.CommunityManager)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.Player)]
        [Authorize(Policy = UserAttribute.SendLoyaltyRewards)]
        public async Task<IActionResult> ResendLoyaltyRewards(ulong xuid, string externalProfileId, [FromBody] string[] gameTitles)
        {
            xuid.IsValidXuid();
            externalProfileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(externalProfileId));
            gameTitles.ShouldNotBeNull(nameof(gameTitles));

            if (!Guid.TryParse(externalProfileId, out var externalProfileIdGuid))
            {
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: (externalProfileId: {externalProfileId})");
            }

            var invalidGameTitles = new List<string>();
            var validGameTitles = new List<WoodstockLoyaltyRewardsTitle>();

            foreach (var gameTitle in gameTitles)
            {
                if (!Enum.TryParse(gameTitle, true, out WoodstockLoyaltyRewardsTitle gameTitleEnum))
                {
                    invalidGameTitles.Add(gameTitle);
                }

                validGameTitles.Add(gameTitleEnum);
            }

            if (invalidGameTitles.Count > 0)
            {
                throw new InvalidArgumentsStewardException($"Game titles: {invalidGameTitles} were not found.");
            }

            var gameTitleEnums = new List<Turn10.UGC.Contracts.GameTitle>();
            foreach (var validTitle in validGameTitles)
            {
                var convertedEnum = this.mapper.SafeMap<Turn10.UGC.Contracts.GameTitle>(validTitle);
                gameTitleEnums.Add(convertedEnum);
            }

            var successResponse = new Dictionary<WoodstockLoyaltyRewardsTitle, bool>();
            var partialSuccess = false;

            foreach (var titleEnum in gameTitleEnums)
            {
                int[] currentGameTitleId = new[] { (int)titleEnum };
                var convertedEnum = this.mapper.SafeMap<WoodstockLoyaltyRewardsTitle>(titleEnum);

                try
                {
                    await this.Services.UserManagementService.ResendProfileHasPlayedNotification(xuid, externalProfileIdGuid, currentGameTitleId).ConfigureAwait(true);
                    successResponse.Add(convertedEnum, true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Failed to resend loyalty rewards. (XUID: {xuid}) (externalProfileId: {externalProfileIdGuid}) (gameTitle: {titleEnum})", ex));
                    successResponse.Add(convertedEnum, false);
                    partialSuccess = true;
                }
            }

            if (partialSuccess)
            {
                return this.StatusCode((int)HttpStatusCode.PartialContent, successResponse);
            }

            return this.Ok(successResponse);
        }
    }
}
