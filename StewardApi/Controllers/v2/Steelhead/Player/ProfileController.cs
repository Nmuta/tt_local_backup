﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM8.Generated;
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
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Handles requests for Steelhead player profile.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/profile/{profileId}")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags("Player", "Steelhead")]
    public class ProfileController : V2ControllerBase
    {

        /// <summary>
        ///     Initializes a new instance of the <see cref="ProfileController"/> class.
        /// </summary>
        public ProfileController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
        }

        /// <summary>
        ///    Saves a player profile.
        /// </summary>
        [HttpPost("save")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Profile)]
        public async Task<IActionResult> SavePlayerProfile(ulong xuid, string profileId, [FromBody] string templateName, [FromQuery] bool overwriteIfExists)
        {
            var services = this.SteelheadServices.Value;
            //xuid.EnsureValidXuid();

            if (!Guid.TryParse(profileId, out var profileIdAsGuid))
            {
                throw new BadRequestStewardException("Profile ID could not be parsed as GUID.");
            }

            await services.LiveOpsService.SaveProfile(profileIdAsGuid, templateName, overwriteIfExists).ConfigureAwait(true);
            return this.Ok();
        }

        /// <summary>
        ///    Loads a player profile.
        /// </summary>
        [HttpPost("load")]
        [SwaggerResponse(200, type: typeof(Guid))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Profile)]
        [AutoActionLogging(TitleCodeName.Steelhead, StewardAction.Update, StewardSubject.Player)]
        public async Task<IActionResult> LoadPlayerProfile(ulong xuid, string profileId, [FromBody] string templateName, [FromQuery] bool continueOnBreakingChanges)
        {
            var services = this.SteelheadServices.Value;
            //xuid.EnsureValidXuid();

            if (!Guid.TryParse(profileId, out var profileIdAsGuid))
            {
                throw new BadRequestStewardException("Profile ID could not be parsed as GUID.");
            }

            var response = await services.LiveOpsService.LoadProfile(profileIdAsGuid, templateName, continueOnBreakingChanges).ConfigureAwait(true);
            return this.Ok(response.currentProfileId);
        }

        /// <summary>
        ///    Resets a player profile.
        /// </summary>
        [HttpPost("reset")]
        [SwaggerResponse(200, type: typeof(Guid))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Profile)]
        [AutoActionLogging(TitleCodeName.Steelhead, StewardAction.Update, StewardSubject.Player)]
        public async Task<IActionResult> ResetPlayerProfile(
            ulong xuid,
            string profileId,
            [FromQuery] bool resetCarProgressData = true,
            [FromQuery] bool resetLeaderboardsData = true,
            [FromQuery] bool resetRaceRankingData = true,
            [FromQuery] bool resetStatsData = true,
            [FromQuery] bool resetTrueSkillData = true,
            [FromQuery] bool resetUserInventoryData = true,
            [FromQuery] bool resetUserSafetyRatingData = true,
            [FromQuery] bool softDeleteInventory = true)
        {
            var services = this.SteelheadServices.Value;
            //xuid.EnsureValidXuid();

            if (!Guid.TryParse(profileId, out var profileIdAsGuid))
            {
                throw new BadRequestStewardException("Profile ID could not be parsed as GUID.");
            }

            var configuration = new ForzaProfileResetConfiguration()
            {
                ResetCarProgressTrackerData = resetCarProgressData,
                ResetLeaderboardsData = resetLeaderboardsData,
                ResetRaceRankingData = resetRaceRankingData,
                ResetStatsData = resetStatsData,
                ResetTrueSkillTrackerData = resetTrueSkillData,
                ResetUserInventoryData = resetUserInventoryData,
                ResetUserSafetyRatingData = resetUserSafetyRatingData,
                SoftDeleteUserInventoryData = softDeleteInventory,
            };

            var response = await services.LiveOpsService.ResetProfile(configuration, profileIdAsGuid).ConfigureAwait(true);
            return this.Ok(response.currentProfileId);
        }
    }
}
