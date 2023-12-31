﻿using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteelheadLiveOpsContent;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
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
        private readonly ISteelheadPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SafetyRatingController"/> class.
        /// </summary>
        public SafetyRatingController(IMapper mapper, ISteelheadPegasusService pegasusService)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.mapper = mapper;
            this.pegasusService = pegasusService;
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
            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);

            var getSafetyRatingConfig = this.GetPlayerSafetyRatingConfigAsync(xuid);
            var getPlayerSafetyRating = this.Services.LiveOpsService.GetLiveOpsSafetyRatingByXuid(xuid);

            await Task.WhenAll(getSafetyRatingConfig, getPlayerSafetyRating);

            var safetyRatingConfig = getSafetyRatingConfig.GetAwaiter().GetResult();
            var playerSafetyRating = getPlayerSafetyRating.GetAwaiter().GetResult();

            var result = this.mapper.SafeMap<SafetyRating>((playerSafetyRating.safetyRating, safetyRatingConfig));

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
            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);

            var safetyRatingConfig = await this.GetPlayerSafetyRatingConfigAsync(xuid);
            await this.Services.LiveOpsService.DeleteLiveOpsOverallSafetyRatingByXuid(xuid);
            var response = await this.Services.LiveOpsService.GetLiveOpsSafetyRatingByXuid(xuid);

            var result = this.mapper.SafeMap<SafetyRating>((response.safetyRating, safetyRatingConfig));

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
            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);
            var safetyRatingConfig = await this.GetPlayerSafetyRatingConfigAsync(xuid);

            foreach (var score in safetyRating.SafetyScores)
            {
                score.ShouldBeGreaterThanOrEqual(safetyRatingConfig.MinScore, nameof(score));
                score.ShouldBeLessThanOrEqual(safetyRatingConfig.MaxScore, nameof(score));
            }

            await this.Services.LiveOpsService.SetLiveOpsSafetyRatingHistory(xuid, safetyRating.SafetyScores);

            var response = await this.Services.LiveOpsService.GetLiveOpsSafetyRatingByXuid(xuid);

            var result = this.mapper.SafeMap<SafetyRating>((response.safetyRating, safetyRatingConfig));

            return this.Ok(result);
        }

        private async Task<SafetyRatingConfiguration> GetPlayerSafetyRatingConfigAsync(ulong xuid)
        {
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid);

            var safetyRatingConfig = await this.pegasusService.GetSafetyRatingConfig(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId);

            return safetyRatingConfig;
        }
    }
}
