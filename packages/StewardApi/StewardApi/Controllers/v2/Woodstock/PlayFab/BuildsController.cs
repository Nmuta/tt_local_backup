using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using Microsoft.AspNetCore.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using WoodstockContracts = Turn10.LiveOps.StewardApi.Contracts.Woodstock;

#pragma warning disable CA1308 // Use .ToUpperInvariant
namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.PlayFab
{
    /// <summary>
    ///     Handles requests for Woodstock PlayFab build integrations.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/playfab/builds")]
    [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock)]
    public class BuildsController : V2WoodstockControllerBase
    {
        private readonly IWoodstockPlayFabService playFabService;
        private readonly IPlayFabBuildLocksProvider playFabBuildLocksProvider;
        private readonly IBlobStorageProvider blobStorageProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BuildsController"/> class for Woodstock.
        /// </summary>
        public BuildsController(IWoodstockPlayFabService playFabService, IPlayFabBuildLocksProvider playFabBuildLocksProvider, IBlobStorageProvider blobStorageProvider)
        {
            playFabService.ShouldNotBeNull(nameof(playFabService));
            playFabBuildLocksProvider.ShouldNotBeNull(nameof(playFabBuildLocksProvider));
            blobStorageProvider.ShouldNotBeNull(nameof(blobStorageProvider));

            this.playFabService = playFabService;
            this.playFabBuildLocksProvider = playFabBuildLocksProvider;
            this.blobStorageProvider = blobStorageProvider;
        }

        /// <summary>
        ///     Retrieves list of PlayFab builds.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<PlayFabBuildSummary>))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        public async Task<IActionResult> GetPlayFabBuilds()
        {
            var playFabEnvironment = this.GetPlayFabEnvironmentFromServices(this.Services.Endpoint);

            try
            {
                var builds = await this.playFabService.GetBuildsAsync(playFabEnvironment).ConfigureAwait(true);

                return this.Ok(builds);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get multiplayer service builds from PlayFab. (playFabEnvironment: {playFabEnvironment})", ex);
            }
        }

        /// <summary>
        ///     Retrieves PlayFab build.
        /// </summary>
        [HttpGet("{buildId}")]
        [SwaggerResponse(200, type: typeof(PlayFabBuildSummary))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        public async Task<IActionResult> GetPlayFabBuild(string buildId)
        {
            var playFabEnvironment = this.GetPlayFabEnvironmentFromServices(this.Services.Endpoint);
            var parsedBuildId = buildId.TryParseGuidElseThrow(nameof(buildId));

            try
            {
                var build = await this.playFabService.GetBuildAsync(parsedBuildId, playFabEnvironment).ConfigureAwait(true);

                return this.Ok(build);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get multiplayer service build from PlayFab. (playFabEnvironment: {playFabEnvironment}) (buildId: {buildId})", ex);
            }
        }

        /// <summary>
        ///     Retrieves list of active PlayFab build lock.
        /// </summary>
        [HttpGet("locks")]
        [SwaggerResponse(200, type: typeof(IList<PlayFabBuildLock>))]
        [LogTagDependency(DependencyLogTags.Cosmos)]
        public async Task<IActionResult> GetActivePlayFabBuildLocks()
        {
            var playFabEnvironment = this.GetPlayFabEnvironmentFromServices(this.Services.Endpoint);

            try
            {
                var buildLocks = await this.playFabBuildLocksProvider.GetMultipleAsync(playFabEnvironment).ConfigureAwait(true);

                return this.Ok(buildLocks);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get build locks from database. (playFabEnvironment: {playFabEnvironment})", ex);
            }
        }

        /// <summary>
        ///     Adds new PlayFab build lock to the database.
        /// </summary>
        [HttpPost("{buildId}/lock")]
        [SwaggerResponse(200, type: typeof(PlayFabBuildLock))]
        [LogTagDependency(DependencyLogTags.Cosmos)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Create)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Add, StewardSubject.PlayFabBuildLock)]
        [Authorize(Policy = UserAttributeValues.ManagePlayFabBuildLocks)]
        public async Task<IActionResult> AddNewPlayFabBuildLock(string buildId, [FromBody] string reason)
        {
            var userClaims = this.User.UserClaims();

            var playFabEnvironment = this.GetPlayFabEnvironmentFromServices(this.Services.Endpoint);
            var parsedBuildId = buildId.TryParseGuidElseThrow(nameof(buildId));

            var playFabBuild = await this.VerifyBuildIdInPlayFabAsync(parsedBuildId, playFabEnvironment).ConfigureAwait(true);

            var activeBuildLocks = await this.playFabBuildLocksProvider.GetMultipleAsync(playFabEnvironment).ConfigureAwait(true);
            var playFabSettings = await this.blobStorageProvider.GetStewardPlayFabSettingsAsync().ConfigureAwait(true);

            // Verify that a build lock does not already exist
            var foundBuildLock = activeBuildLocks.FirstOrDefault((v) => v.Id == parsedBuildId);
            if (foundBuildLock != null)
            {
                throw new BadRequestStewardException($"Cannot add, lock already exists for the provided PlayFab build. (playFabEnvironment: {playFabEnvironment}) (buildId: {buildId})");
            }

            // Verify that the new build lock will not break configured max # of allowed locks
            var expectedBuildLockCount = activeBuildLocks.Count + 1;
            if (expectedBuildLockCount > playFabSettings.MaxBuildLocks)
            {
                throw new BadRequestStewardException($"Maximum number of build locks has already been met. (playFabEnvironment: {playFabEnvironment}) (buildId: {buildId}) (activeBuildLockCount: ${activeBuildLocks.Count}) (activeBuildLockCount: ${playFabSettings.MaxBuildLocks})");
            }

            try
            {
                var buildLock = new PlayFabBuildLock()
                {
                    Id = parsedBuildId,
                    Name = playFabBuild.Name,
                    Reason = reason,
                    UserId = userClaims.ObjectId,
                    PlayFabEnvironment = playFabEnvironment.ToString(),
                    GameTitle = TitleConstants.WoodstockCodeName.ToLowerInvariant(),
                    DateCreatedUtc = DateTimeOffset.UtcNow,
                    MetaData = null,
                };

                var createdLock = await this.playFabBuildLocksProvider.CreateAsync(buildLock).ConfigureAwait(true);

                return this.Ok(createdLock);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to create new build lock. (playFabEnvironment: {playFabEnvironment}) (buildId: {buildId})", ex);
            }
        }

        /// <summary>
        ///     Deletes PlayFab build lock in the database.
        /// </summary>
        [HttpDelete("{buildId}/lock")]
        [SwaggerResponse(200, type: typeof(PlayFabBuildLock))]
        [LogTagDependency(DependencyLogTags.Cosmos)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Delete)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Delete, StewardSubject.PlayFabBuildLock)]
        [Authorize(Policy = UserAttributeValues.ManagePlayFabBuildLocks)]
        public async Task<IActionResult> DeletePlayFabBuildLock(string buildId)
        {
            var playFabEnvironment = this.GetPlayFabEnvironmentFromServices(this.Services.Endpoint);
            var parsedBuildId = buildId.TryParseGuidElseThrow();

            try
            {
                var deletedLock = await this.playFabBuildLocksProvider.DeleteAsync(playFabEnvironment, parsedBuildId).ConfigureAwait(true);

                return this.Ok(deletedLock);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete build lock.(playFabEnvironment: {playFabEnvironment}) (buildId: {buildId})", ex);
            }
        }

        /// <summary>
        ///     Verifies that the build id exists. Throws if it doesn't.
        /// </summary>
        private async Task<PlayFabBuildSummary> VerifyBuildIdInPlayFabAsync(Guid buildId, WoodstockPlayFabEnvironment environment)
        {
            var build = await this.playFabService.GetBuildAsync(buildId, environment).ConfigureAwait(true);
            if (build == null)
            {
                throw new InvalidArgumentsStewardException($"The provided build id does not exist in the specific PlayFab environment. (playFabEnvironment: {environment}) (buildId: {buildId})");
            }

            return build;
        }

        private WoodstockPlayFabEnvironment GetPlayFabEnvironmentFromServices(string servicesEnvironment)
        {
            if (servicesEnvironment == WoodstockContracts.WoodstockEndpoint.Retail)
            {
                return WoodstockPlayFabEnvironment.Retail;
            }
            else if (servicesEnvironment == WoodstockContracts.WoodstockEndpoint.Studio)
            {
                return WoodstockPlayFabEnvironment.Dev;
            }
            else 
            {
                throw new InvalidArgumentsStewardException($"Provided invalid environment to PlayFab. (env: {servicesEnvironment})");
            }
        }
    }
}
