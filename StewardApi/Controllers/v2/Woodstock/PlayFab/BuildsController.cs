using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.TeamFoundation.Build.WebApi;
using PlayFab.MultiplayerModels;
using Swashbuckle.AspNetCore.Annotations;
using Turn10;
using Turn10.Data.Common;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Controllers.V2;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.PlayFab;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab;
using Turn10.Services.LiveOps.FH5_main.Generated;
using Turn10.UGC.Contracts;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using BuildSummary = PlayFab.MultiplayerModels.BuildSummary;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

#pragma warning disable CA1308 // Use .ToUpperInvariant
namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.PlayFab
{
    /// <summary>
    ///     Handles requests for Woodstock PlayFab build integrations.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/playfab/{playFabEnvironment}/builds")]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock)]
    public class BuildsController : V2WoodstockControllerBase
    {
        private readonly IWoodstockPlayFabService playFabService;
        private readonly IPlayFabBuildLocksProvider playFabBuildLocksProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BuildsController"/> class for Steelhead.
        /// </summary>
        public BuildsController(IWoodstockPlayFabService playFabService, IPlayFabBuildLocksProvider playFabBuildLocksProvider)
        {
            playFabService.ShouldNotBeNull(nameof(playFabService));
            playFabBuildLocksProvider.ShouldNotBeNull(nameof(playFabBuildLocksProvider));

            this.playFabService = playFabService;
            this.playFabBuildLocksProvider = playFabBuildLocksProvider;
        }

        /// <summary>
        ///     Retrieves list of PlayFab builds.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<BuildSummary>))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        public async Task<IActionResult> GetPlayFabBuilds(string playFabEnvironment)
        {
            var parsedPlayFabEnvironment = playFabEnvironment.TryParseEnumElseThrow<WoodstockPlayFabEnvironment>(nameof(WoodstockPlayFabEnvironment));

            try
            {
                var builds = await this.playFabService.GetBuildsAsync(parsedPlayFabEnvironment).ConfigureAwait(true);
                return this.Ok(builds);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get multiplayer service builds from PlayFab.", ex);
            }
        }

        /// <summary>
        ///     Retrieves PlayFab build.
        /// </summary>
        [HttpGet("{buildId}")]
        [SwaggerResponse(200, type: typeof(BuildSummary))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        public async Task<IActionResult> GetPlayFabBuild(string playFabEnvironment, string buildId)
        {
            var parsedPlayFabEnvironment = playFabEnvironment.TryParseEnumElseThrow<WoodstockPlayFabEnvironment>(nameof(WoodstockPlayFabEnvironment));
            var parsedBuildId = buildId.TryParseGuidElseThrow(nameof(buildId));

            try
            {
                var build = await this.playFabService.GetBuildAsync(parsedBuildId, parsedPlayFabEnvironment).ConfigureAwait(true);

                return this.Ok(build);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get multiplayer service builds from PlayFab.", ex);
            }
        }

        /// <summary>
        ///     Retrieves list of active PlayFab build lock.
        /// </summary>
        [HttpGet("locks")]
        [SwaggerResponse(200, type: typeof(IList<PlayFabBuildLock>))]
        [LogTagDependency(DependencyLogTags.Cosmos)]
        public async Task<IActionResult> GetActivePlayFabBuildLocks(string playFabEnvironment)
        {
            var parsedPlayFabEnvironment = playFabEnvironment.TryParseEnumElseThrow<WoodstockPlayFabEnvironment>();

            try
            {
                var buildLocks = await this.playFabBuildLocksProvider.GetMultipleAsync(parsedPlayFabEnvironment).ConfigureAwait(true);

                return this.Ok(buildLocks);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get build lock from database.", ex);
            }
        }

        /// <summary>
        ///     Adds new PlayFab build lock to the database.
        /// </summary>
        [HttpPost("{buildId}/lock")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Cosmos)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Create)]
        public async Task<IActionResult> AddNewPlayFabBuildLock(string playFabEnvironment, string buildId, [FromBody] PlayFabBuildLockRequest buildLock)
        {
            var userClaims = this.User.UserClaims();

            var parsedPlayFabEnvironment = playFabEnvironment.TryParseEnumElseThrow<WoodstockPlayFabEnvironment>(nameof(WoodstockPlayFabEnvironment));
            var parsedBuildId = buildId.TryParseGuidElseThrow(nameof(buildId));

            await this.VerifyBuildIdInPlayFabAsync(parsedBuildId, parsedPlayFabEnvironment).ConfigureAwait(true);

            try
            {
                await this.playFabBuildLocksProvider.CreateAsync(new PlayFabBuildLock()
                {
                    Id = parsedBuildId,
                    Reason = buildLock.Reason,
                    IsLocked = true,
                    UserId = userClaims.ObjectId,
                    PlayFabEnvironment = parsedPlayFabEnvironment.ToString(),
                    GameTitle = TitleConstants.WoodstockCodeName.ToLowerInvariant(),
                    MetaData = null,
                }).ConfigureAwait(true);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to create new build lock. (buildId: {buildId})", ex);
            }
        }

        /// <summary>
        ///     Updates PlayFab build lock in the database.
        /// </summary>
        [HttpPut("{buildId}/lock")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Cosmos)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Update)]
        public async Task<IActionResult> UpdatePlayFabBuildLock(string playFabEnvironment, string buildId, [FromBody] PlayFabBuildLockRequest buildLock)
        {
            var userClaims = this.User.UserClaims();

            var parsedPlayFabEnvironment = playFabEnvironment.TryParseEnumElseThrow<WoodstockPlayFabEnvironment>(nameof(WoodstockPlayFabEnvironment));
            var parsedBuildId = buildId.TryParseGuidElseThrow(nameof(buildId));

            await this.VerifyBuildIdInPlayFabAsync(parsedBuildId, parsedPlayFabEnvironment).ConfigureAwait(true);

            try
            {
                await this.playFabBuildLocksProvider.UpdateAsync(parsedBuildId, new PlayFabBuildLock()
                {
                    Id = parsedBuildId,
                    Reason = buildLock.Reason,
                    IsLocked = buildLock.IsLocked,
                    UserId = userClaims.ObjectId,
                    PlayFabEnvironment = parsedPlayFabEnvironment.ToString(),
                    GameTitle = TitleConstants.WoodstockCodeName.ToLowerInvariant(),
                    MetaData = null,
                }).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to update build lock. (buildId: {buildId})", ex);
            }

            return this.Ok();
        }

        /// <summary>
        ///     Deletes PlayFab build lock in the database.
        /// </summary>
        [HttpDelete("{buildId}/lock")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Cosmos)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Delete)]
        public async Task<IActionResult> DeletePlayFabBuildLock(string playFabEnvironment, string buildId)
        {
            // TODO: Verify who can delete locks (only person who created them | anyone with correct Steward perms)
            var parsedPlayFabEnvironment = playFabEnvironment.TryParseEnumElseThrow<WoodstockPlayFabEnvironment>(nameof(WoodstockPlayFabEnvironment));
            var parsedBuildId = buildId.TryParseGuidElseThrow();

            await this.VerifyBuildIdInPlayFabAsync(parsedBuildId, parsedPlayFabEnvironment).ConfigureAwait(true);

            try
            {
                await this.playFabBuildLocksProvider.DeleteAsync(parsedBuildId).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete build lock. (buildId: {buildId})", ex);
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies that the build id exists. Throws if it doesn't.
        /// </summary>
        private async Task<BuildSummary> VerifyBuildIdInPlayFabAsync(Guid buildId, WoodstockPlayFabEnvironment environment)
        {
            var build = await this.playFabService.GetBuildAsync(buildId, environment).ConfigureAwait(true);
            if (build == null)
            {
                throw new InvalidArgumentsStewardException($"The provided build id does not exist in the specific PlayFab environment. (buildId: {buildId}) (playFabEnvironment: {environment})");
            }

            return build;
        }
    }
}
