using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.Authentication;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for Sunrise.
    /// </summary>
    [Route("api/v1/title/Sunrise")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew)]
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

        private readonly IKustoProvider kustoProvider;
        private readonly ISunrisePlayerInventoryProvider sunrisePlayerInventoryProvider;
        private readonly ISunrisePlayerDetailsProvider sunrisePlayerDetailsProvider;
        private readonly ISunriseGiftHistoryProvider giftHistoryProvider;
        private readonly ISunriseBanHistoryProvider banHistoryProvider;
        private readonly IJobTracker jobTracker;
        private readonly IMapper mapper;
        private readonly IScheduler scheduler;
        private readonly IRequestValidator<SunriseMasterInventory> masterInventoryRequestValidator;
        private readonly IRequestValidator<SunriseGift> giftRequestValidator;
        private readonly IRequestValidator<SunriseGroupGift> groupGiftRequestValidator;
        private readonly IRequestValidator<SunriseBanParametersInput> banParametersRequestValidator;
        private readonly string giftingPassword;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseController"/> class.
        /// </summary>
        /// <param name="kustoProvider">The Kusto provider.</param>
        /// <param name="sunrisePlayerInventoryProvider">The Sunrise player inventory provider.</param>
        /// <param name="sunrisePlayerDetailsProvider">The Sunrise player details provider.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        /// <param name="giftHistoryProvider">The gift history provider.</param>
        /// <param name="banHistoryProvider">The ban history provider.</param>
        /// <param name="configuration">The configuration.</param>
        /// <param name="scheduler">The scheduler.</param>
        /// <param name="jobTracker">The job tracker.</param>
        /// <param name="mapper">The mapper.</param>
        /// <param name="masterInventoryRequestValidator">The player inventory request validator.</param>
        /// <param name="giftRequestValidator">The gift request validator.</param>
        /// <param name="groupGiftRequestValidator">The group gift request validator.</param>
        /// <param name="banParametersRequestValidator">The ban parameters request validator.</param>
        public SunriseController(
            IKustoProvider kustoProvider,
            ISunrisePlayerDetailsProvider sunrisePlayerDetailsProvider,
            ISunrisePlayerInventoryProvider sunrisePlayerInventoryProvider,
            IKeyVaultProvider keyVaultProvider,
            ISunriseGiftHistoryProvider giftHistoryProvider,
            ISunriseBanHistoryProvider banHistoryProvider,
            IConfiguration configuration,
            IScheduler scheduler,
            IJobTracker jobTracker,
            IMapper mapper,
            IRequestValidator<SunriseMasterInventory> masterInventoryRequestValidator,
            IRequestValidator<SunriseGift> giftRequestValidator,
            IRequestValidator<SunriseGroupGift> groupGiftRequestValidator,
            IRequestValidator<SunriseBanParametersInput> banParametersRequestValidator)
        {
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            sunrisePlayerDetailsProvider.ShouldNotBeNull(nameof(sunrisePlayerDetailsProvider));
            sunrisePlayerInventoryProvider.ShouldNotBeNull(nameof(sunrisePlayerInventoryProvider));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            configuration.ShouldNotBeNull(nameof(configuration));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            mapper.ShouldNotBeNull(nameof(mapper));
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));
            giftRequestValidator.ShouldNotBeNull(nameof(giftRequestValidator));
            groupGiftRequestValidator.ShouldNotBeNull(nameof(groupGiftRequestValidator));
            banParametersRequestValidator.ShouldNotBeNull(nameof(banParametersRequestValidator));
            configuration.ShouldContainSettings(RequiredSettings);

            this.kustoProvider = kustoProvider;
            this.sunrisePlayerDetailsProvider = sunrisePlayerDetailsProvider;
            this.sunrisePlayerInventoryProvider = sunrisePlayerInventoryProvider;
            this.giftHistoryProvider = giftHistoryProvider;
            this.banHistoryProvider = banHistoryProvider;
            this.scheduler = scheduler;
            this.jobTracker = jobTracker;
            this.mapper = mapper;
            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
            this.giftRequestValidator = giftRequestValidator;
            this.groupGiftRequestValidator = groupGiftRequestValidator;
            this.banParametersRequestValidator = banParametersRequestValidator;

            this.giftingPassword = keyVaultProvider.GetSecretAsync(
                configuration[ConfigurationKeyConstants.KeyVaultUrl],
                configuration[ConfigurationKeyConstants.GroupGiftPasswordSecretName]).GetAwaiter().GetResult();
        }

        /// <summary>
        ///     Gets the master inventory data.
        /// </summary>
        /// <returns>
        ///     <see cref="SunriseMasterInventory"/>.
        /// </returns>
        [HttpGet("masterInventory")]
        [SwaggerResponse(200, type: typeof(SunriseMasterInventory))]
        public async Task<IActionResult> GetMasterInventoryList()
        {
            try
            {
                var cars = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFH4Cars);
                var carHorns = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFH4CarHorns);
                var vanityItems = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFH4VanityItems);
                var emotes = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFH4Emotes);
                var quickChatLines = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFH4QuickChatLines);

                await Task.WhenAll(cars, carHorns, vanityItems, emotes, quickChatLines).ConfigureAwait(true);

                var masterInventory = new SunriseMasterInventory
                {
                    Cars = await cars.ConfigureAwait(true),
                    CarHorns = await carHorns.ConfigureAwait(true),
                    VanityItems = await vanityItems.ConfigureAwait(true),
                    Emotes = await emotes.ConfigureAwait(true),
                    QuickChatLines = await quickChatLines.ConfigureAwait(true)
                };

                return this.Ok(masterInventory);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the player identity.
        /// </summary>
        /// <param name="identityQueries">The identity queries.</param>
        /// <returns>
        ///     The list of <see cref="IdentityResultAlpha"/>.
        /// </returns>
        [HttpPost("players/identities")]
        [SwaggerResponse(200, type: typeof(List<IdentityResultAlpha>))]
        public async Task<IActionResult> GetPlayerIdentity([FromBody] IList<IdentityQueryAlpha> identityQueries)
        {
            try
            {
                var results = new List<IdentityResultAlpha>();
                var queries = new List<Task<IdentityResultAlpha>>();

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
                    return this.NotFound($"Player {xuid} was not found.");
                }

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
        ///     Gets the console details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">A value that specifies how many consoles to return.</param>
        /// <returns>
        ///     A <see cref="List{SunriseConsoleDetails}"/>.
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
        /// <param name="banInput">The ban parameter input.</param>
        /// <param name="useBackgroundProcessing">A value that indicates whether to use background processing.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     The list of <see cref="SunriseBanResult"/>.
        /// </returns>
        [HttpPost("players/ban")]
        [SwaggerResponse(201, type: typeof(List<SunriseBanResult>))]
        [SwaggerResponse(202)]
        public async Task<IActionResult> BanPlayers(
            [FromBody] IList<SunriseBanParametersInput> banInput,
            [FromQuery] bool useBackgroundProcessing,
            [FromHeader] string requestingAgent)
        {
            async Task<List<SunriseBanResult>> BulkBanUsersAsync(List<SunriseBanParameters> groupedBanParameters)
            {
                var tasks =
                    groupedBanParameters.Select(
                        banParameters => this.sunrisePlayerDetailsProvider.BanUsersAsync(banParameters, requestingAgent))
                    .ToList();

                var nestedResults = await Task.WhenAll(tasks).ConfigureAwait(false);
                var results = nestedResults.SelectMany(v => v).ToList();

                return results;
            }

            try
            {
                requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
                banInput.ShouldNotBeNull(nameof(banInput));

                foreach (var banParam in banInput)
                {
                    this.banParametersRequestValidator.ValidateIds(banParam, this.ModelState);
                    this.banParametersRequestValidator.Validate(banParam, this.ModelState);
                }

                if (!this.ModelState.IsValid)
                {
                    var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                    return this.BadRequest(result);
                }

                var groupedBanParameters = banInput.GroupBy(v =>
                    {
                        var compareUsingValues = new object[]
                        {
                            v.BanAllConsoles,
                            v.BanAllPcs,
                            v.DeleteLeaderboardEntries,
                            v.StartTimeUtc,
                            v.Duration,
                            v.SendReasonNotification,
                            v.Reason,
                        };

                        var compareValue = string.Join('|', compareUsingValues);
                        return compareValue;
                    })
                    .Select(group => this.mapper.Map<SunriseBanParameters>(group.ToList()))
                    .ToList();

                if (!useBackgroundProcessing)
                {
                    var results = await BulkBanUsersAsync(groupedBanParameters).ConfigureAwait(true);

                    return this.Created(this.Request.Path, results);
                }

                var username = this.User.GetNameIdentifier();
                var jobId = await this.AddJobIdToHeaderAsync(groupedBanParameters.ToJson(), username).ConfigureAwait(true);

                async Task BackgroundProcessing(CancellationToken cancellationToken)
                {
                    // Throwing within the hosting environment background worker seems to have significant consequences.
                    // Do not throw.
                    try
                    {
                        var results = await BulkBanUsersAsync(groupedBanParameters).ConfigureAwait(true);

                        await this.jobTracker
                            .UpdateJobAsync(
                                jobId,
                                username,
                                BackgroundJobStatus.Completed,
                                results.ToJson())
                            .ConfigureAwait(true);
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
        ///     A list of <see cref="LiveOpsBanHistory"/>.
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
                if (ex is ProfileNotFoundException)
                {
                    return this.NotFound(ex.Message);
                }

                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     A list of <see cref="LiveOpsBanHistory"/>.
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
                if (ex is ProfileNotFoundException)
                {
                    return this.NotFound(ex.Message);
                }

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
        ///     Update player inventories with given items.
        /// </summary>
        /// <param name="groupGift">The group gift.</param>
        /// <param name="useBackgroundProcessing">Indicates whether to use background processing.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        [HttpPost("gifting/players")]
        [SwaggerResponse(200, type: typeof(SunrisePlayerInventory))]
        public async Task<IActionResult> UpdateGroupInventories([FromBody] SunriseGroupGift groupGift, [FromQuery] bool useBackgroundProcessing)
        {
            try
            {
                var requestingAgent = this.User.GetClaimValue(ClaimTypes.Email);

                groupGift.ShouldNotBeNull(nameof(groupGift));
                groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
                requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

                var stringBuilder = new StringBuilder();

                this.groupGiftRequestValidator.ValidateIds(groupGift, this.ModelState);
                this.groupGiftRequestValidator.Validate(groupGift, this.ModelState);

                if (!this.ModelState.IsValid)
                {
                    var errorResponse = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);
                    return this.BadRequest(errorResponse);
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
                    await this.sunrisePlayerInventoryProvider.UpdatePlayerInventoriesAsync(groupGift.Xuids, groupGift, requestingAgent).ConfigureAwait(true);

                    return this.Created(this.Request.Path, groupGift.Inventory);
                }

                var username = this.User.GetNameIdentifier();
                var jobId = await this.AddJobIdToHeaderAsync(groupGift.ToJson(), username).ConfigureAwait(true);

                async Task BackgroundProcessing(CancellationToken cancellationToken)
                {
                    // Throwing within the hosting environment background worker seems to have significant consequences.
                    // Do not throw.
                    try
                    {
                        await this.sunrisePlayerInventoryProvider.UpdatePlayerInventoriesAsync(groupGift.Xuids, groupGift, requestingAgent).ConfigureAwait(true);

                        await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Completed).ConfigureAwait(true);
                    }
                    catch (Exception)
                    {
                        await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Failed).ConfigureAwait(true);
                    }
                }

                this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

                return this.Ok();
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Update inventories for an LSP group.
        /// </summary>
        /// <param name="groupId">The LSP group ID.</param>
        /// <param name="gift">The gift to send.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin)]
        [HttpPost("gifiting/groupId({groupId})")]
        [SwaggerResponse(201, type: typeof(SunriseGift))]
        public async Task<IActionResult> UpdateGroupInventories(int groupId, [FromBody] SunriseGift gift)
        {
            try
            {
                var requestingAgent = this.User.GetClaimValue(ClaimTypes.Email);

                gift.ShouldNotBeNull(nameof(gift));
                requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

                this.giftRequestValidator.Validate(gift, this.ModelState);
                this.giftRequestValidator.ValidateIds(gift, this.ModelState);

                if (!this.ModelState.IsValid)
                {
                    var result = this.masterInventoryRequestValidator.GenerateErrorResponse(this.ModelState);

                    return this.BadRequest(result);
                }

                await this.sunrisePlayerInventoryProvider.UpdateGroupInventoriesAsync(groupId, gift, requestingAgent).ConfigureAwait(true);

                return this.Ok();
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="SunriseGiftHistory"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<SunriseGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(ulong xuid)
        {
            try
            {
                var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(xuid.ToString(CultureInfo.InvariantCulture), TitleConstants.SunriseCodeName, GiftHistoryAntecedent.Xuid).ConfigureAwait(true);

                return this.Ok(giftHistory);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <returns>
        ///     The list of <see cref="SunriseGiftHistory"/>.
        /// </returns>
        [HttpGet("group/groupId({groupId})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<SunriseGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(int groupId)
        {
            try
            {
                var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(groupId.ToString(CultureInfo.InvariantCulture), TitleConstants.SunriseCodeName, GiftHistoryAntecedent.LspGroupId).ConfigureAwait(true);

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

            var banHistories = liveOpsBanHistory.Union(servicesBanHistory, new LiveOpsBanHistoryComparer()).ToList();

            foreach (var banHistory in banHistories)
            {
                banHistory.IsActive = DateTime.UtcNow.CompareTo(banHistory.ExpireTimeUtc) < 0;
            }

            banHistories.Sort((x, y) => DateTime.Compare(y.ExpireTimeUtc, x.ExpireTimeUtc));

            return banHistories;
        }

        private async Task<IdentityResultAlpha> RetrieveIdentity(IdentityQueryAlpha query)
        {
            try
            {
                return await this.sunrisePlayerDetailsProvider.GetPlayerIdentityAsync(query).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                if (ex is ArgumentException)
                {
                    return new IdentityResultAlpha
                    {
                        Error = new StewardError(StewardErrorCode.RequiredParameterMissing, ex.Message),
                        Query = query
                    };
                }

                if (ex is ProfileNotFoundException)
                {
                    return new IdentityResultAlpha
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
