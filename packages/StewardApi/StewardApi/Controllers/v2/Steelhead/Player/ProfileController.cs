using AutoMapper;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Handles requests for Steelhead player profile.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/profile/{profileId}")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.Profile)]
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
        [Authorize(Policy = UserAttributeValues.UpdateProfile)]
        public async Task<IActionResult> SavePlayerProfile(ulong xuid, string profileId, [FromBody] string templateName, [FromQuery] bool overwriteIfExists)
        {
            var services = this.SteelheadServices.Value;
            ////xuid.EnsureValidXuid();

            var profileIdAsGuid = profileId.TryParseGuidElseThrow("Profile ID could not be parsed as GUID.");

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
        [Authorize(Policy = UserAttributeValues.UpdateProfile)]
        public async Task<IActionResult> LoadPlayerProfile(
            ulong xuid, string profileId,
            [FromBody] string templateName,
            [FromQuery] bool continueOnBreakingChanges,
            [FromQuery] string forzaSandbox)
        {
            var services = this.SteelheadServices.Value;
            ////xuid.EnsureValidXuid();

            var profileIdAsGuid = profileId.TryParseGuidElseThrow("Profile ID could not be parsed as GUID.");

            var sandboxEnum = forzaSandbox.TryParseEnumElseThrow<ForzaSandbox>("Forza Sandbox could not be parsed.");

            var response = await services.LiveOpsService.LoadProfile(profileIdAsGuid, templateName, continueOnBreakingChanges, sandboxEnum).ConfigureAwait(true);
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
        [Authorize(Policy = UserAttributeValues.UpdateProfile)]
        public async Task<IActionResult> ResetPlayerProfile(
            ulong xuid,
            string profileId)
        {
            var services = this.SteelheadServices.Value;
            ////xuid.EnsureValidXuid();

            var profileIdAsGuid = profileId.TryParseGuidElseThrow("Profile ID could not be parsed as GUID.");

            var configuration = new ForzaProfileResetConfiguration()
            {
                ResetCarProgressTrackerData = true,
                ResetLeaderboardsData = true,
                ResetRaceRankingData = true,
                ResetStatsData = true,
                ResetTrueSkillTrackerData = true,
                ResetUserInventoryData = true,
                ResetUserSafetyRatingData = true,
                ResetUGCProfileData = true,
            };

            var response = await services.LiveOpsService.ResetProfile(configuration, profileIdAsGuid).ConfigureAwait(true);
            return this.Ok(response.currentProfileId);
        }
    }
}
