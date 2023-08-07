using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Controller for manipulating a player's Skill Rating.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/profile/{profileId}/skillRating")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.SkillRating)]
    public class SkillRatingController : V2SteelheadControllerBase
    {
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SkillRatingController"/> class.
        /// </summary>
        public SkillRatingController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the user's skill rating.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(SkillRatingSummary))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetSkillRatingAsync(
            ulong xuid, string profileId)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            var profileIdGuid = profileId.TryParseGuidElseThrow("Profile ID");

            var response = await this.Services.LiveOpsService.GetUserSkillRating(xuid, profileIdGuid).ConfigureAwait(true);

            var result = this.mapper.SafeMap<SkillRatingSummary>(response.rating);

            return this.Ok(result);
        }

        /// <summary>
        ///     Sets the user's skill rating override.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(SkillRatingSummary))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        [Authorize(Policy = UserAttributeValues.OverrideSkillRating)]
        public async Task<IActionResult> OverrideSkillRatingAsync(
            ulong xuid, string profileId, [FromBody] double skillRating)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            var profileIdGuid = profileId.TryParseGuidElseThrow("Profile ID");

            var validate = await this.Services.LiveOpsService.GetUserSkillRating(xuid, profileIdGuid).ConfigureAwait(true);
            if (skillRating < validate.rating.NormalizationMin || skillRating > validate.rating.NormalizationMax)
            {
                throw new InvalidArgumentsStewardException(
                    $"Skill rating override must be greater than {validate.rating.NormalizationMin} and less than {validate.rating.NormalizationMax}. (SkillRatingOverride: {skillRating})");
            }

            await this.Services.LiveOpsService.OverrideUserSkillRating(xuid, profileIdGuid, skillRating).ConfigureAwait(true);

            var response = await this.Services.LiveOpsService.GetUserSkillRating(xuid, profileIdGuid).ConfigureAwait(true);

            var result = this.mapper.SafeMap<SkillRatingSummary>(response.rating);

            return this.Ok(result);
        }

        /// <summary>
        ///     Clears the user's skill rating override.
        /// </summary>
        [HttpDelete]
        [SwaggerResponse(200, type: typeof(SkillRatingSummary))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        [Authorize(Policy = UserAttributeValues.OverrideSkillRating)]
        public async Task<IActionResult> ClearSkillRatingOverrideAsync(ulong xuid, string profileId)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            var profileIdGuid = profileId.TryParseGuidElseThrow("Profile ID");

            await this.Services.LiveOpsService.ClearUserSkillRatingOverride(xuid, profileIdGuid).ConfigureAwait(true);

            var response = await this.Services.LiveOpsService.GetUserSkillRating(xuid, profileIdGuid).ConfigureAwait(true);

            var result = this.mapper.SafeMap<SkillRatingSummary>(response.rating);

            return this.Ok(result);
        }
    }
}
