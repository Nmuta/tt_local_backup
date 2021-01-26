using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity.Settings;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for Gravity.
    /// </summary>
    [Route("api/v1/title/Gravity")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew)]
    public sealed class GravityController : ControllerBase
    {
        private readonly IGravityPlayerDetailsProvider gravityPlayerDetailsProvider;
        private readonly IGravityPlayerInventoryProvider gravityPlayerInventoryProvider;
        private readonly IGravityGiftHistoryProvider giftHistoryProvider;
        private readonly ISettingsProvider gravitySettingsProvider;
        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;
        private readonly IRequestValidator<GravityPlayerInventory> playerInventoryRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityController"/> class.
        /// </summary>
        /// <param name="gravityPlayerDetailsProvider">The Gravity player details provider.</param>
        /// <param name="gravityPlayerInventoryProvider">The Gravity player inventory provider.</param>
        /// <param name="giftHistoryProvider">The gift history provider.</param>
        /// <param name="gravitySettingsProvider">The Gravity settings provider.</param>
        /// <param name="scheduler">The scheduler.</param>
        /// <param name="jobTracker">The job tracker.</param>
        /// <param name="playerInventoryRequestValidator">The player inventory request validator.</param>
        public GravityController(
                                 IGravityPlayerDetailsProvider gravityPlayerDetailsProvider,
                                 IGravityPlayerInventoryProvider gravityPlayerInventoryProvider,
                                 IGravityGiftHistoryProvider giftHistoryProvider,
                                 ISettingsProvider gravitySettingsProvider,
                                 IScheduler scheduler,
                                 IJobTracker jobTracker,
                                 IRequestValidator<GravityPlayerInventory> playerInventoryRequestValidator)
        {
            gravityPlayerDetailsProvider.ShouldNotBeNull(nameof(gravityPlayerDetailsProvider));
            gravityPlayerInventoryProvider.ShouldNotBeNull(nameof(gravityPlayerInventoryProvider));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            gravitySettingsProvider.ShouldNotBeNull(nameof(gravitySettingsProvider));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            playerInventoryRequestValidator.ShouldNotBeNull(nameof(playerInventoryRequestValidator));

            this.gravityPlayerDetailsProvider = gravityPlayerDetailsProvider;
            this.gravityPlayerInventoryProvider = gravityPlayerInventoryProvider;
            this.giftHistoryProvider = giftHistoryProvider;
            this.gravitySettingsProvider = gravitySettingsProvider;
            this.scheduler = scheduler;
            this.jobTracker = jobTracker;
            this.playerInventoryRequestValidator = playerInventoryRequestValidator;
        }

        /// <summary>
        ///     Gets the player identity.
        /// </summary>
        /// <param name="identityQueries">The identity queries.</param>
        /// <returns>
        ///     The list of <see cref="IdentityResultBeta"/>.
        /// </returns>
        [HttpPost("players/identities")]
        [SwaggerResponse(200, type: typeof(List<IdentityResultBeta>))]
        public async Task<IActionResult> GetPlayerIdentity([FromBody] IList<IdentityQueryBeta> identityQueries)
        {
            try
            {
                var results = new List<IdentityResultBeta>();
                var queries = new List<Task<IdentityResultBeta>>();

                foreach (var query in identityQueries)
                {
                    queries.Add(this.RetrieveIdentity(query));
                }

                await Task.WhenAll(queries).ConfigureAwait(true);

                foreach (var query in queries)
                {
                    results.Add(await query.ConfigureAwait(true));
                }

                return this.Ok(results);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerDetails"/>.
        /// </returns>
        [HttpGet("player/gamertag({gamertag})/details")]
        [SwaggerResponse(200, type: typeof(GravityPlayerDetails))]
        [SwaggerResponse(404, type: typeof(string))]
        public async Task<IActionResult> GetPlayerDetails(string gamertag)
        {
            try
            {
                gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

                var playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);

                return this.Ok(playerDetails);
            }
            catch (Exception ex)
            {
                if (ex is ProfileNotFoundException)
                {
                    return this.NotFound(ex.Message);
                }

                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerDetails"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/details")]
        [SwaggerResponse(200, type: typeof(GravityPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(ulong xuid)
        {
            try
            {
                var playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsAsync(xuid).ConfigureAwait(true);

                return this.Ok(playerDetails);
            }
            catch (Exception ex)
            {
                if (ex is ProfileNotFoundException)
                {
                    return this.NotFound(ex.Message);
                }

                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerDetails"/>.
        /// </returns>
        [HttpGet("player/t10Id({t10Id})/details")]
        [SwaggerResponse(200, type: typeof(GravityPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetailsByT10Id(string t10Id)
        {
            try
            {
                t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

                var playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsByT10IdAsync(t10Id).ConfigureAwait(true);

                return this.Ok(playerDetails);
            }
            catch (Exception ex)
            {
                if (ex is ProfileNotFoundException)
                {
                    return this.NotFound(ex.Message);
                }

                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/inventory")]
        [SwaggerResponse(200, type: typeof(GravityPlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(ulong xuid)
        {
            try
            {
                var inventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(xuid).ConfigureAwait(true);

                if (inventory == null)
                {
                    return this.NotFound($"No inventory found for XUID: {xuid}");
                }

                return this.Ok(inventory);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        [HttpGet("player/t10Id({t10Id})/inventory")]
        [SwaggerResponse(200, type: typeof(GravityPlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(string t10Id)
        {
            try
            {
                t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

                var inventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(t10Id).ConfigureAwait(true);

                if (inventory == null)
                {
                    return this.NotFound($"No inventory found for Turn 10 ID: {t10Id}");
                }

                return this.Ok(inventory);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/profileId({profileId})/inventory")]
        [SwaggerResponse(200, type: typeof(GravityPlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(ulong xuid, string profileId)
        {
            try
            {
                profileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(profileId));

                var inventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(xuid, profileId).ConfigureAwait(true);

                if (inventory == null)
                {
                    return this.NotFound($"No inventory found for XUID: {xuid}");
                }

                return this.Ok(inventory);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        [HttpGet("player/t10Id({t10Id})/profileId({profileId})/inventory")]
        [SwaggerResponse(200, type: typeof(GravityPlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(string t10Id, string profileId)
        {
            try
            {
                t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
                profileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(profileId));

                var inventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(t10Id, profileId).ConfigureAwait(true);

                if (inventory == null)
                {
                    return this.NotFound($"No inventory found for Turn 10 ID: {t10Id}");
                }

                return this.Ok(inventory);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Update the player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="useBackgroundProcessing">Indicates whether to use background processing.</param>
        /// <returns>
        ///     The updated <see cref="GravityPlayerInventory"/>.
        /// </returns>
        [HttpPost("player/xuid/inventory")]
        [SwaggerResponse(201, type: typeof(GravityPlayerInventory))]
        [SwaggerResponse(202)]
        public async Task<IActionResult> UpdatePlayerInventoryByXuid([FromBody] GravityPlayerInventory playerInventory, [FromHeader]string requestingAgent, [FromQuery] bool useBackgroundProcessing = false)
        {
            try
            {
                playerInventory.ShouldNotBeNull(nameof(playerInventory));
                requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

                this.playerInventoryRequestValidator.ValidateIds(playerInventory, this.ModelState);
                this.playerInventoryRequestValidator.Validate(playerInventory, this.ModelState);

                if (!this.ModelState.IsValid)
                {
                    var result = this.playerInventoryRequestValidator.GenerateErrorResponse(this.ModelState);

                    return this.BadRequest(result);
                }

                if (!await this.gravityPlayerDetailsProvider.EnsurePlayerExistsAsync(playerInventory.Xuid)
                    .ConfigureAwait(true))
                {
                    return this.NotFound($"No inventory found for XUID: {playerInventory.Xuid}");
                }

                if (!useBackgroundProcessing)
                {
                    await this.gravityPlayerInventoryProvider.UpdatePlayerInventoryAsync(playerInventory.Xuid, playerInventory, requestingAgent).ConfigureAwait(true);
                    var results = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(playerInventory.Xuid).ConfigureAwait(true);

                    return this.Created(this.Request.Path, results);
                }

                var username = this.User.GetNameIdentifier();
                var jobId = await this.AddJobIdToHeaderAsync(playerInventory.ToJson(), username).ConfigureAwait(true);

                async Task BackgroundProcessing(CancellationToken cancellationToken)
                {
                    // Throwing within the hosting environment background worker seems to have significant consequences.
                    // Do not throw.
                    try
                    {
                        await this.gravityPlayerInventoryProvider.UpdatePlayerInventoryAsync(playerInventory.Xuid, playerInventory, requestingAgent).ConfigureAwait(true);
                        var result = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(playerInventory.Xuid).ConfigureAwait(true);

                        await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Completed, result.ToJson()).ConfigureAwait(true);
                    }
                    catch (Exception)
                    {
                        await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Failed)
                            .ConfigureAwait(true);
                    }
                }

                this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

                return this.Accepted();
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Update the player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="useBackgroundProcessing">Indicates whether to use background processing.</param>
        /// <returns>
        ///     The updated <see cref="GravityPlayerInventory"/>.
        /// </returns>
        [HttpPost("player/t10Id/inventory")]
        [SwaggerResponse(201, type: typeof(GravityPlayerInventory))]
        [SwaggerResponse(202)]
        public async Task<IActionResult> UpdatePlayerInventoryByT10Id([FromBody] GravityPlayerInventory playerInventory, [FromHeader] string requestingAgent, [FromQuery] bool useBackgroundProcessing = false)
        {
            try
            {
                playerInventory.ShouldNotBeNull(nameof(playerInventory));
                playerInventory.T10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(playerInventory.T10Id));
                requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

                this.playerInventoryRequestValidator.ValidateIds(playerInventory, this.ModelState);
                this.playerInventoryRequestValidator.Validate(playerInventory, this.ModelState);

                if (!this.ModelState.IsValid)
                {
                    var result = this.playerInventoryRequestValidator.GenerateErrorResponse(this.ModelState);

                    return this.BadRequest(result);
                }

                if (!await this.gravityPlayerDetailsProvider.EnsurePlayerExistsByT10IdAsync(playerInventory.T10Id).ConfigureAwait(true))
                {
                    return this.NotFound($"No inventory found for T10Id: {playerInventory.T10Id}");
                }

                if (!useBackgroundProcessing)
                {
                    await this.gravityPlayerInventoryProvider.UpdatePlayerInventoryAsync(playerInventory.T10Id, playerInventory, requestingAgent).ConfigureAwait(true);
                    var results = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(playerInventory.T10Id).ConfigureAwait(true);

                    return this.Created(this.Request.Path, results);
                }

                var username = this.User.GetNameIdentifier();
                var jobId = await this.AddJobIdToHeaderAsync(playerInventory.ToJson(), username).ConfigureAwait(true);

                async Task BackgroundProcessing(CancellationToken cancellationToken)
                {
                    // Throwing within the hosting environment background worker seems to have significant consequences.
                    // Do not throw.
                    try
                    {
                        await this.gravityPlayerInventoryProvider.UpdatePlayerInventoryAsync(playerInventory.T10Id, playerInventory, requestingAgent).ConfigureAwait(true);
                        var result = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(playerInventory.Xuid).ConfigureAwait(true);

                        await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Completed, result.ToJson()).ConfigureAwait(true);
                    }
                    catch (Exception)
                    {
                        await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Failed).ConfigureAwait(true);
                    }
                }

                this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

                return this.Accepted();
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Get game settings.
        /// </summary>
        /// <param name="gameSettingsId">The game settings ID.</param>
        /// <returns>
        ///     The <see cref="GameSettings"/>.
        /// </returns>
        [HttpGet("data/gameSettingsId({gameSettingsId})")]
        [SwaggerResponse(200, type: typeof(GameSettings))]
        [SwaggerResponse(404, type: typeof(string))]
        public async Task<IActionResult> GetGameSettings(string gameSettingsId)
        {
            try
            {
                gameSettingsId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gameSettingsId));

                var gameSettings = await this.gravitySettingsProvider.GetGameSettingAsync(new Guid(gameSettingsId)).ConfigureAwait(true);

                return this.Ok(gameSettings);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     The list of <see cref="GravityGiftHistory"/>.
        /// </returns>
        [HttpGet("player/t10Id({t10Id})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<GravityGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(string t10Id)
        {
            try
            {
                t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

                var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(t10Id, TitleConstants.GravityCodeName, GiftHistoryAntecedent.T10Id).ConfigureAwait(true);

                return this.Ok(giftHistory);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        private async Task<string> AddJobIdToHeaderAsync(string requestBody, string username)
        {
            var jobId = await this.jobTracker.CreateNewJobAsync(requestBody, username).ConfigureAwait(true);

            this.Response.Headers.Add("jobId", jobId);

            return jobId;
        }

        private async Task<IdentityResultBeta> RetrieveIdentity(IdentityQueryBeta query)
        {
            try
            {
                return await this.gravityPlayerDetailsProvider.GetPlayerIdentityAsync(query).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                if (ex is ArgumentException)
                {
                    return new IdentityResultBeta
                    {
                        Error = new StewardError(StewardErrorCode.RequiredParameterMissing, ex.Message),
                        Query = query
                    };
                }

                if (ex is ProfileNotFoundException)
                {
                    return new IdentityResultBeta
                    {
                        Error = new StewardError(StewardErrorCode.ProfileNotFound, ex.Message),
                        Query = query
                    };
                }

                throw;
            }
        }
    }
}
