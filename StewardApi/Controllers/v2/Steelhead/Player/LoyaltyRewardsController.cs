using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
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
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.HorizonDesigner,
        UserRole.MotorsportDesigner,
        UserRole.MediaTeam)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.LoyaltyRewards)]
    public class LoyaltyRewardsController : V2SteelheadControllerBase
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
        ///     Gets the user's profile notes.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<ForzaLoyaltyRewardsSupportedTitles>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetHasPlayedRecordAsync(
            ulong xuid)
        {
            //xuid.IsValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            ForzaLoyaltyRewardsSupportedTitles[] titlesPlayed = null;
            try
            {
                var response = await this.Services.LiveOpsService.GetTitlesUserPlayed(xuid).ConfigureAwait(true);
                titlesPlayed = response.titlesPlayed;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No record of legacy titles played found. (XUID: {xuid})", ex);
            }

            var convertedList = this.mapper.SafeMap<IList<SteelheadLoyaltyRewardsTitle>>(titlesPlayed);

            return this.Ok(convertedList);
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
        [AutoActionLogging(TitleCodeName.Steelhead, StewardAction.Update, StewardSubject.Player)]
        [Authorize(Policy = UserAttribute.SendLoyaltyRewards)]
        public async Task<IActionResult> UpdateTitlesUserPlayed(ulong xuid, [FromBody] string gameTitle)
        {
            //xuid.IsValidXuid();
            gameTitle.ShouldNotBeNull(nameof(gameTitle));

            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            if (!Enum.TryParse(gameTitle, true, out SteelheadLoyaltyRewardsTitle gameTitleEnum))
            {
                throw new InvalidArgumentsStewardException($"Game title: {gameTitle} was not found.");
            }

            var convertedEnum = this.mapper.SafeMap<ForzaLoyaltyRewardsSupportedTitles>(gameTitleEnum);

            try
            {
                await this.Services.LiveOpsService.AddToTitlesUserPlayed(xuid, convertedEnum).ConfigureAwait(true);

            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to update titles played. (XUID: {xuid})", ex);
            }

            return this.Ok();
        }
    }
}
