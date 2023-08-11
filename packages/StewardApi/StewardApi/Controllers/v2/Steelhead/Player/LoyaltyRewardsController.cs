using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/loyalty")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.LoyaltyRewards)]
    public class LoyaltyRewardsController : V2SteelheadControllerBase
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
        ///     Gets the user's profile notes.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<ForzaLoyaltyRewardsSupportedTitles>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetHasPlayedRecordAsync(
            ulong xuid)
        {
            ////xuid.IsValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            ForzaLoyaltyRewardsSupportedTitles[] titlesPlayed = null;
            var response = await this.Services.LiveOpsService.GetTitlesUserPlayed(xuid).ConfigureAwait(true);
            titlesPlayed = response.titlesPlayed;

            var convertedList = this.mapper.SafeMap<IList<SteelheadLoyaltyRewardsTitle>>(titlesPlayed);

            return this.Ok(convertedList);
        }

        /// <summary>
        ///    Sends Loyalty Rewards for selected titles.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(Dictionary<SteelheadLoyaltyRewardsTitle, bool>))]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Steelhead, StewardAction.Update, StewardSubject.Player)]
        [Authorize(Policy = UserAttributeValues.SendLoyaltyRewards)]
        public async Task<IActionResult> ResendLoyaltyRewards(ulong xuid, [FromBody] IList<string> gameTitles)
        {
            ////xuid.IsValidXuid();
            gameTitles.ShouldNotBeNull(nameof(gameTitles));

            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            var invalidGameTitles = new List<string>();
            var validGameTitles = new List<SteelheadLoyaltyRewardsTitle>();

            foreach (var gameTitle in gameTitles)
            {
                if (!Enum.TryParse(gameTitle, true, out SteelheadLoyaltyRewardsTitle gameTitleEnum))
                {
                    invalidGameTitles.Add(gameTitle);
                }

                validGameTitles.Add(gameTitleEnum);
            }

            if (invalidGameTitles.Count > 0)
            {
                throw new InvalidArgumentsStewardException($"Game titles: {string.Join(", ", invalidGameTitles)} were not found.");
            }

            var successResponse = new Dictionary<SteelheadLoyaltyRewardsTitle, bool>();
            var partialSuccess = false;

            foreach (var titleEnum in validGameTitles)
            {
                try
                {
                    ForzaLoyaltyRewardsSupportedTitles convertedEnum = this.mapper.SafeMap<ForzaLoyaltyRewardsSupportedTitles>(titleEnum);

                    if (!Enum.IsDefined(typeof(ForzaLoyaltyRewardsSupportedTitles), convertedEnum))
                    {
                        throw new InvalidArgumentsStewardException($"Game title: {titleEnum} is not a valid game title.");
                    }

                    await this.Services.LiveOpsService.AddToTitlesUserPlayed(xuid, convertedEnum).ConfigureAwait(true);
                    //await this.Services.UserManagementService.ResendProfileHasPlayedNotification(xuid, )
                    successResponse.Add(titleEnum, true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Failed to add {titleEnum} to {xuid}'s previously played titles.", ex));
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
