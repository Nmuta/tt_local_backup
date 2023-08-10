using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Controller for manipulating a player's Safety Rating.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/safetyRating")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.SafetyRating)]
    public class SafetyRatingController : V2SteelheadControllerBase
    {
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SafetyRatingController"/> class.
        /// </summary>
        public SafetyRatingController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the user's safety rating.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(SafetyRating))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetSafetyRatingAsync(
            ulong xuid)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            var response = await this.Services.LiveOpsService.GetLiveOpsSafetyRatingByXuid(xuid).ConfigureAwait(true);

            var result = this.mapper.SafeMap<SafetyRating>(response.safetyRating);

            return this.Ok(result);
        }

        /// <summary>
        ///     Clears the user's safety rating history.
        /// </summary>
        [HttpDelete]
        [SwaggerResponse(200, type: typeof(SafetyRating))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Meta)]
        [Authorize(Policy = UserAttributeValues.UpdateSafetyRating)]
        public async Task<IActionResult> ClearSafetyRatingAsync(
            ulong xuid)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            await this.Services.LiveOpsService.DeleteLiveOpsOverallSafetyRatingByXuid(xuid).ConfigureAwait(true);

            var response = await this.Services.LiveOpsService.GetLiveOpsSafetyRatingByXuid(xuid).ConfigureAwait(true);

            var result = this.mapper.SafeMap<SafetyRating>(response.safetyRating);

            return this.Ok(result);
        }

        /// <summary>
        ///     Sets the user's safety rating history.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(SafetyRating))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Meta)]
        [Authorize(Policy = UserAttributeValues.UpdateSafetyRating)]
        public async Task<IActionResult> SetSafetyRatingAsync(
            ulong xuid, [FromBody] SafetyRatingInput safetyRating)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);
            safetyRating.Score.ShouldBeGreaterThanOrEqual(0, nameof(safetyRating.Score));
            safetyRating.Score.ShouldBeLessThanOrEqual(100, nameof(safetyRating.Score));

            // TODO: This is actually configurable in CMS. Task to integrate these config properties:
            // https://dev.azure.com/t10motorsport/ForzaTech/_workitems/edit/1545818
            // Probation is determined by length of safety rating history. Fewer than 5 entries means in probation.
            // We want to abstract that away from the user. So we ask them if they want to be in probation.
            // If they want to be in probation, their safety rating must have fewer than 5 entries, so we set it to 1.
            // If they don't want to be in probation, we must make their safety rating more than 5 entries, so we use 10.
            var arrayLength = safetyRating.IsInProbationaryPeriod ? 1 : 10;
            var scoreArray = new double[arrayLength];
            Array.Fill<double>(scoreArray, safetyRating.Score);

            await this.Services.LiveOpsService.SetLiveOpsSafetyRatingHistory(xuid, scoreArray).ConfigureAwait(true);

            var response = await this.Services.LiveOpsService.GetLiveOpsSafetyRatingByXuid(xuid).ConfigureAwait(true);

            var result = this.mapper.SafeMap<SafetyRating>(response.safetyRating);

            return this.Ok(result);
        }
    }
}
