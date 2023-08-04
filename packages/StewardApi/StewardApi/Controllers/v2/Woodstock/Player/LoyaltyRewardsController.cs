using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
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
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Player, Topic.LoyaltyRewards)]
    public class LoyaltyRewardsController : V2WoodstockControllerBase
    {
        private readonly IMapper mapper;
        private readonly ILoggingService loggingService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LoyaltyRewardsController"/> class.
        /// </summary>
        public LoyaltyRewardsController(IMapper mapper, ILoggingService loggingService)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));

            this.mapper = mapper;
            this.loggingService = loggingService;
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

            UserManagementService.GetHasPlayedRecordOutput response = await this.Services.UserManagementService.GetHasPlayedRecord(xuid, externalProfileIdGuid).ConfigureAwait(true);

            var hasPlayedRecord = this.mapper.SafeMap<IList<HasPlayedRecord>>(response.records);

            return this.Ok(hasPlayedRecord);
        }

        /// <summary>
        ///    Sends Loyalty Rewards for selected titles.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(Dictionary<WoodstockLoyaltyRewardsTitle, bool>))]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.Player)]
        [Authorize(Policy = UserAttributeValues.SendLoyaltyRewards)]
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
                throw new InvalidArgumentsStewardException($"Game titles: {string.Join(", ", invalidGameTitles)} were not found.");
            }

            var successResponse = new Dictionary<WoodstockLoyaltyRewardsTitle, bool>();
            var partialSuccess = false;

            foreach (var titleEnum in validGameTitles)
            {
                try
                {
                    Turn10.UGC.Contracts.GameTitle convertedEnum = this.mapper.SafeMap<Turn10.UGC.Contracts.GameTitle>(titleEnum);

                    if (!Enum.IsDefined(typeof(Turn10.UGC.Contracts.GameTitle), convertedEnum))
                    {
                        throw new InvalidArgumentsStewardException($"Game title: {titleEnum} is not a valid game title.");
                    }

                    int[] currentGameTitleId = new[] { (int)titleEnum };
                    await this.Services.UserManagementService.ResendProfileHasPlayedNotification(xuid, externalProfileIdGuid, currentGameTitleId).ConfigureAwait(true);
                    successResponse.Add(titleEnum, true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Failed to resend loyalty rewards. (XUID: {xuid}) (externalProfileId: {externalProfileIdGuid}) (gameTitle: {titleEnum})", ex));
                    successResponse.Add(titleEnum, false);
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
