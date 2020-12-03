using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for Sunrise.
    /// </summary>
    [Route("api/v1/title/Sunrise")]
    [ApiController]
    [Authorize]
    public sealed class SunriseController : ControllerBase
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 100;
        private const KustoGameDbSupportedTitle Title = KustoGameDbSupportedTitle.Sunrise;

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KeyVaultUrl,
            ConfigurationKeyConstants.GroupGiftPasswordSecretName
        };

        private readonly ISunrisePlayerInventoryProvider sunrisePlayerInventoryProvider;
        private readonly ISunrisePlayerDetailsProvider sunrisePlayerDetailsProvider;
        private readonly ISunriseGiftHistoryProvider giftHistoryProvider;
        private readonly ISunriseBanHistoryProvider banHistoryProvider;
        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;
        private readonly IRequestValidator<SunrisePlayerInventory> playerInventoryRequestValidator;
        private readonly IRequestValidator<SunriseGroupGift> groupGiftRequestValidator;
        private readonly IRequestValidator<SunriseBanParameters> banParametersRequestValidator;
        private readonly string giftingPassword;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseController"/> class.
        /// </summary>
        /// <param name="sunrisePlayerInventoryProvider">The Sunrise player inventory provider.</param>
        /// <param name="sunrisePlayerDetailsProvider">The Sunrise player details provider.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        /// <param name="giftHistoryProvider">The gift history provider.</param>
        /// <param name="banHistoryProvider">The ban history provider.</param>
        /// <param name="configuration">The configuration.</param>
        /// <param name="scheduler">The scheduler.</param>
        /// <param name="jobTracker">The job tracker.</param>
        /// <param name="playerInventoryRequestValidator">The player inventory request validator.</param>
        /// <param name="groupGiftRequestValidator">The group gift request validator.</param>
        /// <param name="banParametersRequestValidator">The ban parameters request validator.</param>
        public SunriseController(
                                 ISunrisePlayerDetailsProvider sunrisePlayerDetailsProvider,
                                 ISunrisePlayerInventoryProvider sunrisePlayerInventoryProvider,
                                 IKeyVaultProvider keyVaultProvider,
                                 ISunriseGiftHistoryProvider giftHistoryProvider,
                                 ISunriseBanHistoryProvider banHistoryProvider,
                                 IConfiguration configuration,
                                 IScheduler scheduler,
                                 IJobTracker jobTracker,
                                 IRequestValidator<SunrisePlayerInventory> playerInventoryRequestValidator,
                                 IRequestValidator<SunriseGroupGift> groupGiftRequestValidator,
                                 IRequestValidator<SunriseBanParameters> banParametersRequestValidator)
        {
            sunrisePlayerDetailsProvider.ShouldNotBeNull(nameof(sunrisePlayerDetailsProvider));
            sunrisePlayerInventoryProvider.ShouldNotBeNull(nameof(sunrisePlayerInventoryProvider));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            configuration.ShouldNotBeNull(nameof(configuration));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            playerInventoryRequestValidator.ShouldNotBeNull(nameof(playerInventoryRequestValidator));
            groupGiftRequestValidator.ShouldNotBeNull(nameof(groupGiftRequestValidator));
            banParametersRequestValidator.ShouldNotBeNull(nameof(banParametersRequestValidator));
            configuration.ShouldContainSettings(RequiredSettings);

            this.sunrisePlayerDetailsProvider = sunrisePlayerDetailsProvider;
            this.sunrisePlayerInventoryProvider = sunrisePlayerInventoryProvider;
            this.giftHistoryProvider = giftHistoryProvider;
            this.banHistoryProvider = banHistoryProvider;
            this.scheduler = scheduler;
            this.jobTracker = jobTracker;
            this.playerInventoryRequestValidator = playerInventoryRequestValidator;
            this.groupGiftRequestValidator = groupGiftRequestValidator;
            this.banParametersRequestValidator = banParametersRequestValidator;

            this.giftingPassword = keyVaultProvider.GetSecretAsync(
                configuration[ConfigurationKeyConstants.KeyVaultUrl],
                configuration[ConfigurationKeyConstants.GroupGiftPasswordSecretName]).GetAwaiter().GetResult();
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerDetails"/>.
        /// </returns>
        [HttpGet("player/gamertag({gamertag})/details")]
        [SwaggerResponse(200, type: typeof(SunrisePlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(string gamertag)
        {
            try
            {
                gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

                var playerDetails = await this.sunrisePlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);

                if (playerDetails == null)
                {
                    return this.NotFound($"Player {gamertag} was not found.");
                }

                return this.Ok(playerDetails);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerDetails"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/details")]
        [SwaggerResponse(200, type: typeof(SunrisePlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(ulong xuid)
        {
            try
            {
                var playerDetails = await this.sunrisePlayerDetailsProvider.GetPlayerDetailsAsync(xuid).ConfigureAwait(true);

                if (playerDetails == null)
                {
                    return this.NotFound($"No profile found for XUID: {xuid}.");
                }

                return this.Ok(playerDetails);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the console details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">A value that specifies how many consoles to return.</param>
        /// <returns>
        ///     The list of <see cref="SunriseConsoleDetails"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/consoleDetails")]
        [SwaggerResponse(200, type: typeof(List<SunriseConsoleDetails>))]
        public async Task<IActionResult> GetConsoles(ulong xuid, [FromQuery] int maxResults = DefaultMaxResults)
        {
            try
            {
                maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

                var result = await this.sunrisePlayerDetailsProvider.GetConsolesAsync(xuid, maxResults).ConfigureAwait(true);

                if (result == null)
                {
                    return this.NotFound($"No profile found for XUID: {xuid}.");
                }

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="SunriseSharedConsoleUser"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/sharedConsoleUsers")]
        [SwaggerResponse(200, type: typeof(List<SunriseSharedConsoleUser>))]
        public async Task<IActionResult> GetSharedConsoleUsers(ulong xuid, [FromQuery] int startIndex = DefaultStartIndex, [FromQuery] int maxResults = DefaultMaxResults)
        {
            try
            {
                startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
                maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

                var result = await this.sunrisePlayerDetailsProvider.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults).ConfigureAwait(true);

                if (result == null)
                {
                    return this.NotFound($"No profile found for XUID: {xuid}.");
                }

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets user flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunriseUserFlags"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/userFlags")]
        [SwaggerResponse(200, type: typeof(SunriseUserFlags))]
        public async Task<IActionResult> GetUserFlags(ulong xuid)
        {
            try
            {
                if (!await this.sunrisePlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
                {
                    return this.NotFound($"No profile found for XUID: {xuid}.");
                }

                var result = await this.sunrisePlayerDetailsProvider.GetUserFlagsAsync(xuid).ConfigureAwait(true);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Sets user flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="userFlags">The user flags.</param>
        /// <returns>
        ///     The updated <see cref="SunriseUserFlags"/>.
        /// </returns>
        [HttpPut("player/xuid({xuid})/userFlags")]
        [SwaggerResponse(200, type: typeof(SunriseUserFlags))]
        public async Task<IActionResult> SetUserFlags(ulong xuid, [FromBody] SunriseUserFlags userFlags)
        {
            try
            {
                userFlags.ShouldNotBeNull(nameof(userFlags));

                if (!await this.sunrisePlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
                {
                    return this.NotFound($"No profile found for XUID: {xuid}.");
                }

                await this.sunrisePlayerDetailsProvider.SetUserFlagsAsync(xuid, userFlags).ConfigureAwait(true);

                var results = await this.sunrisePlayerDetailsProvider.GetUserFlagsAsync(xuid).ConfigureAwait(true);

                return this.Ok(results);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the profile summary.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunriseProfileSummary"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/profileSummary")]
        [SwaggerResponse(200, type: typeof(SunriseProfileSummary))]
        public async Task<IActionResult> GetProfileSummary(ulong xuid)
        {
            try
            {
                var result = await this.sunrisePlayerDetailsProvider.GetProfileSummaryAsync(xuid).ConfigureAwait(true);

                if (result == null)
                {
                    return this.NotFound($"No profile found for XUID: {xuid}.");
                }

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets credit updates.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="SunriseCreditUpdate"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/creditUpdates")]
        [SwaggerResponse(200, type: typeof(List<SunriseCreditUpdate>))]
        public async Task<IActionResult> GetCreditUpdates(ulong xuid, [FromQuery] int startIndex = DefaultStartIndex, [FromQuery] int maxResults = DefaultMaxResults)
        {
            try
            {
                startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
                maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

                var result = await this.sunrisePlayerDetailsProvider.GetCreditUpdatesAsync(xuid, startIndex, maxResults).ConfigureAwait(true);

                if (result == null)
                {
                    return this.NotFound($"No profile found for XUID: {xuid}.");
                }

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        /// <param name="banParameters">The ban parameters.</param>
        /// <param name="useBackgroundProcessing">A value that indicates whether to use background processing.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     The list of <see cref="SunriseBanResult"/>.
        /// </returns>
        [HttpPost("players/ban")]
        [SwaggerResponse(201, type: typeof(List<SunriseBanResult>))]
        [SwaggerResponse(202)]
        public async Task<IActionResult> BanPlayers([FromBody] SunriseBanParameters banParameters, [FromQuery] bool useBackgroundProcessing, [FromHeader] string requestingAgent)
        {
            try
            {
                requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
                banParameters.ShouldNotBeNull(nameof(banParameters));
                this.banParametersRequestValidator.ValidateIds(banParameters, this.ModelState);
                this.banParametersRequestValidator.Validate(banParameters, this.ModelState);

                if (!this.ModelState.IsValid)
                {
                    var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                    return this.BadRequest(result);
                }

                if (!useBackgroundProcessing)
                {
                    var results = await this.sunrisePlayerDetailsProvider.BanUsersAsync(banParameters, requestingAgent).ConfigureAwait(true);

                    return this.Created(this.Request.Path, results);
                }

                var username = this.User.Identity.Name;
                var jobId = await this.AddJobIdToHeaderAsync(banParameters.ToJson(), username).ConfigureAwait(true);

                async Task BackgroundProcessing(CancellationToken cancellationToken)
                {
                    // Throwing within the hosting environment background worker seems to have significant consequences.
                    // Do not throw.
                    try
                    {
                        var results = await this.sunrisePlayerDetailsProvider.BanUsersAsync(banParameters, requestingAgent).ConfigureAwait(true);

                        await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Completed, results.ToJson()).ConfigureAwait(true);
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
        ///     Gets ban summaries.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <returns>
        ///     The list of <see cref="SunriseBanSummary"/>.
        /// </returns>
        [HttpPost("players/banSummaries")]
        [SwaggerResponse(200, type: typeof(List<SunriseBanSummary>))]
        public async Task<IActionResult> GetBanSummaries([FromBody] IList<ulong> xuids)
        {
            try
            {
                xuids.ShouldNotBeNull(nameof(xuids));

                var result = await this.sunrisePlayerDetailsProvider.GetUserBanSummariesAsync(xuids).ConfigureAwait(true);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="LiveOpsBanHistory"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/banHistory")]
        [SwaggerResponse(200, type: typeof(IList<LiveOpsBanHistory>))]
        public async Task<IActionResult> GetBanHistory(ulong xuid)
        {
            try
            {
                var result = await this.GetBanHistoryAsync(xuid).ConfigureAwait(true);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="SunriseBanHistory"/>.
        /// </returns>
        [HttpGet("player/gamertag({gamertag})/banHistory")]
        [SwaggerResponse(200, type: typeof(IList<LiveOpsBanHistory>))]
        public async Task<IActionResult> GetBanHistory(string gamertag)
        {
            try
            {
                gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

                var playerDetails = await this.sunrisePlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);

                if (playerDetails == null)
                {
                    return this.NotFound($"Player {gamertag} was not found.");
                }

                var result = await this.GetBanHistoryAsync(playerDetails.Xuid).ConfigureAwait(true);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Sets consoles ban status.
        /// </summary>
        /// <param name="consoleId">The console ID.</param>
        /// <param name="isBanned">A value indicating whether the console is banned.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        [HttpPut("console/consoleId({consoleId})/consoleBanStatus/isBanned({isBanned})")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> SetConsoleBanStatus(ulong consoleId, bool isBanned)
        {
            try
            {
                await this.sunrisePlayerDetailsProvider.SetConsoleBanStatusAsync(consoleId, isBanned).ConfigureAwait(true);

                return this.Ok();
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
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/inventory")]
        [SwaggerResponse(200, type: typeof(SunrisePlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(ulong xuid)
        {
            try
            {
                var inventory = await this.sunrisePlayerInventoryProvider.GetPlayerInventoryAsync(xuid).ConfigureAwait(true);

                if (inventory == null)
                {
                    return this.NotFound($"No inventory found for XUID: {xuid}.");
                }

                return this.Ok(inventory);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player inventory profiles.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="SunriseInventoryProfile"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/inventoryProfiles")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> GetPlayerInventoryProfiles(ulong xuid)
        {
            try
            {
                var inventoryProfileSummary = await this.sunrisePlayerInventoryProvider.GetInventoryProfilesAsync(xuid).ConfigureAwait(true);

                if (inventoryProfileSummary == null)
                {
                    return this.NotFound($"No inventory profiles found for XUID: {xuid}.");
                }

                return this.Ok(inventoryProfileSummary);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        [HttpGet("player/profileId({profileId})/inventory")]
        [SwaggerResponse(200, type: typeof(SunrisePlayerInventory))]
        public async Task<IActionResult> GetPlayerInventoryByProfileId(int profileId)
        {
            try
            {
                var inventory = await this.sunrisePlayerInventoryProvider.GetPlayerInventoryAsync(profileId).ConfigureAwait(true);

                if (inventory == null)
                {
                    return this.NotFound($"No inventory found for Profile ID: {profileId}.");
                }

                return this.Ok(inventory);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Get groups.
        /// </summary>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="SunriseLspGroup"/>.
        /// </returns>
        [HttpGet("groups")]
        [SwaggerResponse(200, type: typeof(IList<SunriseLspGroup>))]
        public async Task<IActionResult> GetGroups([FromQuery] int startIndex = DefaultStartIndex, [FromQuery] int maxResults = DefaultMaxResults)
        {
            try
            {
                startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
                maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

                var result = await this.sunrisePlayerInventoryProvider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(true);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Updates the player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="useBackgroundProcessing">Indicates whether to use background processing.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        [HttpPost("player/xuid/inventory")]
        [SwaggerResponse(201, type: typeof(SunrisePlayerInventory))]
        [SwaggerResponse(202)]
        public async Task<IActionResult> UpdatePlayerInventory([FromBody] SunrisePlayerInventory playerInventory, [FromQuery] bool useBackgroundProcessing, [FromHeader] string requestingAgent)
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

                if (!await this.sunrisePlayerDetailsProvider.EnsurePlayerExistsAsync(playerInventory.Xuid).ConfigureAwait(true))
                {
                    return this.NotFound($"No profile found for XUID: {playerInventory.Xuid}.");
                }

                if (!useBackgroundProcessing)
                {
                    await this.sunrisePlayerInventoryProvider.UpdatePlayerInventoryAsync(playerInventory.Xuid, playerInventory, requestingAgent).ConfigureAwait(true);

                    return this.Created(this.Request.Path, playerInventory);
                }

                var username = this.User.Identity.Name;
                var jobId = await this.AddJobIdToHeaderAsync(playerInventory.ToJson(), username).ConfigureAwait(true);

                async Task BackgroundProcessing(CancellationToken cancellationToken)
                {
                    // Throwing within the hosting environment background worker seems to have significant consequences.
                    // Do not throw.
                    try
                    {
                        await this.sunrisePlayerInventoryProvider.UpdatePlayerInventoryAsync(playerInventory.Xuid, playerInventory, requestingAgent).ConfigureAwait(true);

                        await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Completed, playerInventory.ToJson()).ConfigureAwait(true);
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
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupGift">The group gift.</param>
        /// <param name="useBackgroundProcessing">Indicates whether to use background processing.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        [HttpPost("group/xuids/inventory")]
        [SwaggerResponse(201, type: typeof(SunrisePlayerInventory))]
        [SwaggerResponse(202)]
        public async Task<IActionResult> UpdateGroupInventories([FromBody] SunriseGroupGift groupGift, [FromQuery] bool useBackgroundProcessing, [FromHeader] string requestingAgent)
        {
            try
            {
                groupGift.ShouldNotBeNull(nameof(groupGift));
                requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

                var stringBuilder = new StringBuilder();

                this.groupGiftRequestValidator.ValidateIds(groupGift, this.ModelState);
                this.groupGiftRequestValidator.Validate(groupGift, this.ModelState);

                if (!this.ModelState.IsValid)
                {
                    var result = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);

                    return this.BadRequest(result);
                }

                foreach (var xuid in groupGift.Xuids)
                {
                    if (!await this.sunrisePlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
                    {
                        stringBuilder.Append($"{xuid} ");
                    }
                }

                if (stringBuilder.Length > 0)
                {
                    return this.NotFound($"Players with XUIDs: {stringBuilder} were not found.");
                }

                if (!useBackgroundProcessing)
                {
                    await this.sunrisePlayerInventoryProvider.UpdatePlayerInventoriesAsync(groupGift.Xuids, groupGift.GiftInventory, requestingAgent).ConfigureAwait(true);

                    return this.Created(this.Request.Path, groupGift.GiftInventory);
                }

                var username = this.User.Identity.Name;
                var jobId = await this.AddJobIdToHeaderAsync(groupGift.ToJson(), username).ConfigureAwait(true);

                async Task BackgroundProcessing(CancellationToken cancellationToken)
                {
                    // Throwing within the hosting environment background worker seems to have significant consequences.
                    // Do not throw.
                    try
                    {
                        await this.sunrisePlayerInventoryProvider.UpdatePlayerInventoriesAsync(groupGift.Xuids, groupGift.GiftInventory, requestingAgent).ConfigureAwait(true);

                        await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Completed).ConfigureAwait(true);
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
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupGift">The group gift.</param>
        /// <param name="useBackgroundProcessing">Indicates whether to use background processing.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        [HttpPost("group/gamertags/inventory")]
        [SwaggerResponse(201, type: typeof(SunrisePlayerInventory))]
        [SwaggerResponse(202)]
        public async Task<IActionResult> UpdateGroupInventoriesByGamertags(
            [FromBody] SunriseGroupGift groupGift,
            [FromQuery] bool useBackgroundProcessing,
            [FromHeader] string requestingAgent)
        {
            try
            {
                groupGift.ShouldNotBeNull(nameof(groupGift));
                requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

                var stringBuilder = new StringBuilder();

                this.groupGiftRequestValidator.ValidateIds(groupGift, this.ModelState);
                this.groupGiftRequestValidator.Validate(groupGift, this.ModelState);

                if (!this.ModelState.IsValid)
                {
                    var result = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);

                    return this.BadRequest(result);
                }

                foreach (var gamertag in groupGift.Gamertags)
                {
                    if (!await this.sunrisePlayerDetailsProvider.EnsurePlayerExistsAsync(gamertag).ConfigureAwait(true))
                    {
                        stringBuilder.Append($"{gamertag} ");
                    }
                }

                if (stringBuilder.Length > 0)
                {
                    return this.NotFound($"Players with gamertags: {stringBuilder} were not found.");
                }

                if (!useBackgroundProcessing)
                {
                    await this.sunrisePlayerInventoryProvider.UpdatePlayerInventoriesAsync(groupGift.Gamertags, groupGift.GiftInventory, requestingAgent).ConfigureAwait(true);

                    return this.Created(this.Request.Path, groupGift.GiftInventory);
                }

                var username = this.User.Identity.Name;
                var jobId = await this.AddJobIdToHeaderAsync(groupGift.ToJson(), username).ConfigureAwait(true);

                async Task BackgroundProcessing(CancellationToken cancellationToken)
                {
                    // Throwing within the hosting environment background worker seems to have significant consequences.
                    // Do not throw.
                    try
                    {
                        await this.sunrisePlayerInventoryProvider.UpdatePlayerInventoriesAsync(groupGift.Gamertags, groupGift.GiftInventory, requestingAgent).ConfigureAwait(true);

                        await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Completed).ConfigureAwait(true);
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
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="adminAuth">The admin auth.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        [HttpPost("group/groupId({groupId})/inventory")]
        [SwaggerResponse(201, type: typeof(SunrisePlayerInventory))]
        public async Task<IActionResult> UpdateGroupInventories(
            int groupId,
            [FromBody] SunrisePlayerInventory playerInventory,
            [FromHeader] string adminAuth,
            [FromHeader] string requestingAgent)
        {
            try
            {
                playerInventory.ShouldNotBeNull(nameof(playerInventory));
                adminAuth.ShouldNotBeNullEmptyOrWhiteSpace(nameof(adminAuth));
                requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

                if (adminAuth != this.giftingPassword)
                {
                    return this.Unauthorized("adminAuth header was incorrect.");
                }

                this.playerInventoryRequestValidator.ValidateIds(playerInventory, this.ModelState);
                this.playerInventoryRequestValidator.Validate(playerInventory, this.ModelState);

                if (!this.ModelState.IsValid)
                {
                    var result = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);

                    return this.BadRequest(result);
                }

                await this.sunrisePlayerInventoryProvider.UpdateGroupInventoriesAsync(groupId, playerInventory, requestingAgent).ConfigureAwait(true);

                return this.Created(this.Request.Path, playerInventory);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        /// <param name="giftHistoryAntecedent">The gift history antecedent.</param>
        /// <param name="giftRecipientId">The gift recipient ID.</param>
        /// <returns>
        ///     The list of <see cref="SunriseGiftHistory"/>.
        /// </returns>
        [HttpGet("giftHistory/giftRecipientId({giftRecipientId})/giftHistoryAntecedent({giftHistoryAntecedent})")]
        [SwaggerResponse(200, type: typeof(IList<SunriseGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(GiftHistoryAntecedent giftHistoryAntecedent, string giftRecipientId)
        {
            try
            {
                giftRecipientId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(giftRecipientId));

                var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(giftRecipientId, Title.ToString(), giftHistoryAntecedent).ConfigureAwait(true);

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

        private async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid)
        {
            var getServicesBanHistory = this.sunrisePlayerDetailsProvider.GetUserBanHistoryAsync(xuid);
            var getLiveOpsBanHistory = this.banHistoryProvider.GetBanHistoriesAsync(xuid, Title.ToString());

            await Task.WhenAll(getServicesBanHistory, getLiveOpsBanHistory).ConfigureAwait(true);

            var servicesBanHistory = await getServicesBanHistory.ConfigureAwait(true);
            var liveOpsBanHistory = await getLiveOpsBanHistory.ConfigureAwait(true);

            var currentTimeUtc = DateTime.UtcNow;
            var banHistoryUnion = liveOpsBanHistory
                .Union(servicesBanHistory, new LiveOpsBanHistoryComparer())
                .Select(x =>
                {
                    x.IsActive = currentTimeUtc.CompareTo(x.ExpireTimeUtc) < 0;
                    return x;
                }).ToList();

            banHistoryUnion.Sort((x, y) => DateTime.Compare(y.ExpireTimeUtc, x.ExpireTimeUtc));

            return banHistoryUnion;
        }
    }
}
