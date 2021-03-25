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
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.Authentication;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for Apollo.
    /// </summary>
    [Route("api/v1/title/Apollo")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew)]
    public sealed class ApolloController : ControllerBase
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 100;

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KeyVaultUrl,
            ConfigurationKeyConstants.GroupGiftPasswordSecretName
        };

        private readonly ILoggingService loggingService;
        private readonly IKustoProvider kustoProvider;
        private readonly IApolloPlayerDetailsProvider apolloPlayerDetailsProvider;
        private readonly IApolloPlayerInventoryProvider apolloPlayerInventoryProvider;
        private readonly IApolloGiftHistoryProvider giftHistoryProvider;
        private readonly IApolloBanHistoryProvider banHistoryProvider;
        private readonly IScheduler scheduler;
        private readonly IJobTracker jobTracker;
        private readonly IMapper mapper;
        private readonly IRequestValidator<ApolloBanParametersInput> banParametersRequestValidator;
        private readonly IRequestValidator<ApolloGift> giftRequestValidator;
        private readonly IRequestValidator<ApolloGroupGift> groupGiftRequestValidator;
        private readonly IRequestValidator<ApolloUserFlagsInput> userFlagsRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloController"/> class.
        /// </summary>
        /// <param name="loggingService">The logging service.</param>
        /// <param name="kustoProvider">The Kusto provider.</param>
        /// <param name="apolloPlayerDetailsProvider">The Apollo player details provider.</param>
        /// <param name="apolloPlayerInventoryProvider">The Apollo player inventory provider.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        /// <param name="giftHistoryProvider">The gift history provider.</param>
        /// <param name="banHistoryProvider">The ban history provider.</param>
        /// <param name="configuration">The configuration.</param>
        /// <param name="scheduler">The scheduler.</param>
        /// <param name="jobTracker">The job tracker.</param>
        /// <param name="mapper">The mapper.</param>
        /// <param name="banParametersRequestValidator">The ban parameters request validator.</param>
        /// <param name="giftRequestValidator">The gift request validator.</param>
        /// <param name="groupGiftRequestValidator">The group gift request validator.</param>
        /// <param name="userFlagsRequestValidator">The user flags request validator.</param>
        public ApolloController(
            ILoggingService loggingService,
            IKustoProvider kustoProvider,
            IApolloPlayerDetailsProvider apolloPlayerDetailsProvider,
            IApolloPlayerInventoryProvider apolloPlayerInventoryProvider,
            IKeyVaultProvider keyVaultProvider,
            IApolloGiftHistoryProvider giftHistoryProvider,
            IApolloBanHistoryProvider banHistoryProvider,
            IConfiguration configuration,
            IScheduler scheduler,
            IJobTracker jobTracker,
            IMapper mapper,
            IRequestValidator<ApolloBanParametersInput> banParametersRequestValidator,
            IRequestValidator<ApolloGift> giftRequestValidator,
            IRequestValidator<ApolloGroupGift> groupGiftRequestValidator,
            IRequestValidator<ApolloUserFlagsInput> userFlagsRequestValidator)
        {
            loggingService.ShouldNotBeNull(nameof(loggingService));
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            apolloPlayerDetailsProvider.ShouldNotBeNull(nameof(apolloPlayerDetailsProvider));
            apolloPlayerInventoryProvider.ShouldNotBeNull(nameof(apolloPlayerInventoryProvider));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            configuration.ShouldNotBeNull(nameof(configuration));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            mapper.ShouldNotBeNull(nameof(mapper));
            banParametersRequestValidator.ShouldNotBeNull(nameof(banParametersRequestValidator));
            giftRequestValidator.ShouldNotBeNull(nameof(giftRequestValidator));
            groupGiftRequestValidator.ShouldNotBeNull(nameof(groupGiftRequestValidator));
            userFlagsRequestValidator.ShouldNotBeNull(nameof(userFlagsRequestValidator));
            configuration.ShouldContainSettings(RequiredSettings);

            this.loggingService = loggingService;
            this.kustoProvider = kustoProvider;
            this.apolloPlayerDetailsProvider = apolloPlayerDetailsProvider;
            this.apolloPlayerInventoryProvider = apolloPlayerInventoryProvider;
            this.giftHistoryProvider = giftHistoryProvider;
            this.banHistoryProvider = banHistoryProvider;
            this.scheduler = scheduler;
            this.jobTracker = jobTracker;
            this.mapper = mapper;
            this.banParametersRequestValidator = banParametersRequestValidator;
            this.giftRequestValidator = giftRequestValidator;
            this.groupGiftRequestValidator = groupGiftRequestValidator;
            this.userFlagsRequestValidator = userFlagsRequestValidator;
        }

        /// <summary>
        ///     Gets the master inventory data.
        /// </summary>
        /// <returns>
        ///     <see cref="ApolloMasterInventory"/>.
        /// </returns>
        [HttpGet("masterInventory")]
        [SwaggerResponse(200, type: typeof(ApolloMasterInventory))]
        public async Task<IActionResult> GetMasterInventoryList()
        {
            try
            {
                var masterInventory = await this.RetrieveMasterInventoryList().ConfigureAwait(true);
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

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="ApolloPlayerDetails"/>.
        /// </returns>
        [HttpGet("player/gamertag({gamertag})/details")]
        [SwaggerResponse(200, type: typeof(ApolloPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var playerDetails = await this.apolloPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="ApolloPlayerDetails"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/details")]
        [SwaggerResponse(200, type: typeof(ApolloPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(ulong xuid)
        {
            var playerDetails = await this.apolloPlayerDetailsProvider.GetPlayerDetailsAsync(xuid).ConfigureAwait(true);

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        /// <param name="banInput">The list of ban parameters.</param>
        /// <returns>
        ///     The list of <see cref="ApolloBanResult"/>.
        /// </returns>
        [HttpPost("players/ban/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        public async Task<IActionResult> BanPlayersUseBackgroundProcessing([FromBody] IList<ApolloBanParametersInput> banInput)
        {
            var user = this.User.UserModel();
            var requestingAgent = user.EmailAddress ?? user.Id;

            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            banInput.ShouldNotBeNull(nameof(banInput));

            foreach (var banParam in banInput)
            {
                this.banParametersRequestValidator.ValidateIds(banParam, this.ModelState);
                this.banParametersRequestValidator.Validate(banParam, this.ModelState);
            }

            var banParameters = this.mapper.Map<IList<ApolloBanParameters>>(banInput);

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                return this.BadRequest(result);
            }

            var username = this.User.GetNameIdentifier();
            var jobId = await this.AddJobIdToHeaderAsync(banParameters.ToJson(), username).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var results = await this.apolloPlayerDetailsProvider.BanUsersAsync(banParameters, requestingAgent).ConfigureAwait(true);

                    await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Completed, results).ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Accepted(new BackgroundJob
            {
                JobId = jobId,
                Status = BackgroundJobStatus.InProgress.ToString(),
            });
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        /// <param name="banInput">The list of ban parameters.</param>
        /// <returns>
        ///     The list of <see cref="ApolloBanResult"/>.
        /// </returns>
        [HttpPost("players/ban")]
        [SwaggerResponse(201, type: typeof(List<ApolloBanResult>))]
        public async Task<IActionResult> BanPlayers([FromBody] IList<ApolloBanParametersInput> banInput)
        {
            var user = this.User.UserModel();
            var requestingAgent = user.EmailAddress ?? user.Id;

            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            banInput.ShouldNotBeNull(nameof(banInput));

            foreach (var banParam in banInput)
            {
                this.banParametersRequestValidator.ValidateIds(banParam, this.ModelState);
                this.banParametersRequestValidator.Validate(banParam, this.ModelState);
            }

            var banParameters = this.mapper.Map<IList<ApolloBanParameters>>(banInput);

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                return this.BadRequest(result);
            }

            var results = await this.apolloPlayerDetailsProvider.BanUsersAsync(banParameters, requestingAgent).ConfigureAwait(true);

            return this.Ok(results);
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="LiveOpsBanHistory"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/banHistory")]
        [SwaggerResponse(200, type: typeof(IList<LiveOpsBanHistory>))]
        public async Task<IActionResult> GetBanHistory(ulong xuid)
        {
            var result = await this.GetBanHistoryAsync(xuid).ConfigureAwait(true);

            return this.Ok(result);
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
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var playerDetails = await this.apolloPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);

            var result = await this.GetBanHistoryAsync(playerDetails.Xuid).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <returns>
        ///     The list of <see cref="ApolloBanSummary"/>.
        /// </returns>
        [HttpPost("players/banSummaries")]
        [SwaggerResponse(200, type: typeof(List<ApolloBanSummary>))]
        public async Task<IActionResult> GetBanSummaries([FromBody] IList<ulong> xuids)
        {
            xuids.ShouldNotBeNull(nameof(xuids));

            var result = await this.apolloPlayerDetailsProvider.GetUserBanSummariesAsync(xuids).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets the console details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">A value that specifies how many consoles to return.</param>
        /// <returns>
        ///     The list of <see cref="ApolloConsoleDetails"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/consoleDetails")]
        [SwaggerResponse(200, type: typeof(List<ApolloConsoleDetails>))]
        public async Task<IActionResult> GetConsoles(ulong xuid, [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var result = await this.apolloPlayerDetailsProvider.GetConsolesAsync(xuid, maxResults).ConfigureAwait(true);

            return this.Ok(result);
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
            await this.apolloPlayerDetailsProvider.SetConsoleBanStatusAsync(consoleId, isBanned).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="ApolloSharedConsoleUser"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/sharedConsoleUsers")]
        [SwaggerResponse(200, type: typeof(List<ApolloSharedConsoleUser>))]
        public async Task<IActionResult> GetSharedConsoleUsers(ulong xuid, [FromQuery] int startIndex = DefaultStartIndex, [FromQuery] int maxResults = DefaultMaxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var result = await this.apolloPlayerDetailsProvider.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Get groups.
        /// </summary>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="ApolloLspGroup"/>.
        /// </returns>
        [HttpGet("groups")]
        [SwaggerResponse(200, type: typeof(IList<ApolloLspGroup>))]
        public async Task<IActionResult> GetGroups([FromQuery] int startIndex = DefaultStartIndex, [FromQuery] int maxResults = DefaultMaxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var result = await this.apolloPlayerDetailsProvider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets user flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="ApolloUserFlags"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/userFlags")]
        [SwaggerResponse(200, type: typeof(ApolloUserFlags))]
        public async Task<IActionResult> GetUserFlags(ulong xuid)
        {
            if (!await this.apolloPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
            {
                return this.NotFound($"No profile found for XUID: {xuid}.");
            }

            var result = await this.apolloPlayerDetailsProvider.GetUserFlagsAsync(xuid).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Sets user flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="userFlags">The user flags.</param>
        /// <returns>
        ///     The updated <see cref="ApolloUserFlags"/>.
        /// </returns>
        [HttpPut("player/xuid({xuid})/userFlags")]
        [SwaggerResponse(200, type: typeof(ApolloUserFlags))]
        public async Task<IActionResult> SetUserFlags(ulong xuid, [FromBody] ApolloUserFlagsInput userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            this.userFlagsRequestValidator.Validate(userFlags, this.ModelState);
            if (!this.ModelState.IsValid)
            {
                var result = this.userFlagsRequestValidator.GenerateErrorResponse(this.ModelState);
                return this.BadRequest(result);
            }

            if (!await this.apolloPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
            {
                return this.NotFound($"No profile found for XUID: {xuid}.");
            }

            var validatedFlags = this.mapper.Map<ApolloUserFlags>(userFlags);
            await this.apolloPlayerDetailsProvider.SetUserFlagsAsync(xuid, validatedFlags).ConfigureAwait(true);

            var results = await this.apolloPlayerDetailsProvider.GetUserFlagsAsync(xuid).ConfigureAwait(true);

            return this.Ok(results);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="ApolloMasterInventory"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/inventory")]
        [SwaggerResponse(200, type: typeof(ApolloMasterInventory))]
        public async Task<IActionResult> GetPlayerInventory(ulong xuid)
        {
            if (!await this.apolloPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
            {
                return this.NotFound($"No profile found for XUID: {xuid}.");
            }

            var getPlayerInventory = this.apolloPlayerInventoryProvider.GetPlayerInventoryAsync(xuid);
            var getMasterInventory = this.RetrieveMasterInventoryList();

            await Task.WhenAll(getPlayerInventory, getMasterInventory).ConfigureAwait(true);

            var playerInventory = await getPlayerInventory.ConfigureAwait(true);
            var masterInventory = await getMasterInventory.ConfigureAwait(true);

            if (playerInventory == null)
            {
                return this.NotFound($"No inventory found for XUID: {xuid}.");
            }

            playerInventory = StewardMasterItemHelpers.SetItemDescriptions(playerInventory, masterInventory, this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="ApolloMasterInventory"/>.
        /// </returns>
        [HttpGet("player/profileId({profileId})/inventory")]
        [SwaggerResponse(200, type: typeof(ApolloMasterInventory))]
        public async Task<IActionResult> GetPlayerInventory(int profileId)
        {
            var getPlayerInventory = this.apolloPlayerInventoryProvider.GetPlayerInventoryAsync(profileId);
            var getMasterInventory = this.RetrieveMasterInventoryList();

            await Task.WhenAll(getPlayerInventory, getMasterInventory).ConfigureAwait(true);

            var playerInventory = await getPlayerInventory.ConfigureAwait(true);
            var masterInventory = await getMasterInventory.ConfigureAwait(true);

            if (playerInventory == null)
            {
                return this.NotFound($"No inventory found for Profile ID: {profileId}");
            }

            playerInventory = StewardMasterItemHelpers.SetItemDescriptions(playerInventory, masterInventory, this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory profiles.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="ApolloInventoryProfile"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/inventoryProfiles")]
        [SwaggerResponse(200, type: typeof(IList<ApolloInventoryProfile>))]
        public async Task<IActionResult> GetPlayerInventoryProfiles(ulong xuid)
        {
            var profiles = await this.apolloPlayerInventoryProvider.GetInventoryProfilesAsync(xuid).ConfigureAwait(true);

            if (profiles == null)
            {
                return this.NotFound($"No profiles found for XUID: {xuid}");
            }

            return this.Ok(profiles);
        }

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupGift">The group gift.</param>
        /// <returns>
        ///     A <see cref="BackgroundJob"/>.
        /// </returns>
        [HttpPost("gifting/players/useBackgroundProcessing")]
        [SwaggerResponse(200, type: typeof(BackgroundJob))]
        public async Task<IActionResult> UpdateGroupInventoriesUseBackgroundProcessing([FromBody] ApolloGroupGift groupGift)
        {
            var user = this.User.UserModel();
            var requestingAgent = user.EmailAddress ?? user.Id;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var stringBuilder = new StringBuilder();

            this.groupGiftRequestValidator.Validate(groupGift, this.ModelState);
            this.groupGiftRequestValidator.ValidateIds(groupGift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var result = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);
                return this.BadRequest(result);
            }

            foreach (var xuid in groupGift.Xuids)
            {
                if (!await this.apolloPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
                {
                    stringBuilder.Append($"{xuid} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                return this.NotFound($"Players with XUIDs: {stringBuilder} were not found.");
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventory(groupGift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                return this.BadRequest($"Invalid items found. {invalidItems}");
            }

            var username = this.User.GetNameIdentifier();
            var jobId = await this.AddJobIdToHeaderAsync(groupGift.ToJson(), username).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var allowedToExceedCreditLimit = user.Role == UserRole.SupportAgentAdmin || user.Role == UserRole.LiveOpsAdmin;
                    var response = await this.apolloPlayerInventoryProvider.UpdatePlayerInventoriesAsync(groupGift, requestingAgent, allowedToExceedCreditLimit).ConfigureAwait(true);
                    await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Completed, response).ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Accepted(new BackgroundJob
            {
                JobId = jobId,
                Status = BackgroundJobStatus.InProgress.ToString(),
            });
        }

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupGift">The group gift.</param>
        /// <returns>
        ///     A <see cref="IList{GiftResponse}"/>.
        /// </returns>
        [HttpPost("gifting/players")]
        [SwaggerResponse(200, type: typeof(IList<GiftResponse<ulong>>))]
        public async Task<IActionResult> UpdateGroupInventories([FromBody] ApolloGroupGift groupGift)
        {
            var user = this.User.UserModel();
            var requestingAgent = user.EmailAddress ?? user.Id;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            var stringBuilder = new StringBuilder();

            this.groupGiftRequestValidator.Validate(groupGift, this.ModelState);
            this.groupGiftRequestValidator.ValidateIds(groupGift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var result = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);
                return this.BadRequest(result);
            }

            foreach (var xuid in groupGift.Xuids)
            {
                if (!await this.apolloPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
                {
                    stringBuilder.Append($"{xuid} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                return this.NotFound($"Players with XUIDs: {stringBuilder} were not found.");
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventory(groupGift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                return this.BadRequest($"Invalid items found. {invalidItems}");
            }

            var allowedToExceedCreditLimit = user.Role == UserRole.SupportAgentAdmin || user.Role == UserRole.LiveOpsAdmin;
            var response = await this.apolloPlayerInventoryProvider.UpdatePlayerInventoriesAsync(groupGift, requestingAgent, allowedToExceedCreditLimit).ConfigureAwait(true);
            return this.Ok(response);
        }

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <param name="gift">The player inventory.</param>
        /// <returns>
        ///     The <see cref="GiftResponse{T}"/>.
        /// </returns>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin)]
        [HttpPost("gifting/groupId({groupId})")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> UpdateGroupInventories(int groupId, [FromBody] ApolloGift gift)
        {
            var user = this.User.UserModel();
            var requestingAgent = user.EmailAddress ?? user.Id;

            gift.ShouldNotBeNull(nameof(gift));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            this.giftRequestValidator.Validate(gift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var result = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);

                return this.BadRequest(result);
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventory(gift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                return this.BadRequest($"Invalid items found. {invalidItems}");
            }

            var allowedToExceedCreditLimit = user.Role == UserRole.SupportAgentAdmin || user.Role == UserRole.LiveOpsAdmin;
            var response = await this.apolloPlayerInventoryProvider.UpdateGroupInventoriesAsync(groupId, gift, requestingAgent, allowedToExceedCreditLimit).ConfigureAwait(true);
            return this.Ok(response);
            }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="ApolloGiftHistory"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<ApolloGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(ulong xuid)
        {
            var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(xuid.ToString(CultureInfo.InvariantCulture), TitleConstants.ApolloCodeName, GiftIdentityAntecedent.Xuid).ConfigureAwait(true);

            return this.Ok(giftHistory);
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <returns>
        ///     The list of <see cref="ApolloGiftHistory"/>.
        /// </returns>
        [HttpGet("group/groupId({groupId})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<ApolloGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(int groupId)
        {
            var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(groupId.ToString(CultureInfo.InvariantCulture), TitleConstants.ApolloCodeName, GiftIdentityAntecedent.LspGroupId).ConfigureAwait(true);

            return this.Ok(giftHistory);
        }

        private async Task<string> AddJobIdToHeaderAsync(string requestBody, string username)
        {
            var jobId = await this.jobTracker.CreateNewJobAsync(requestBody, username).ConfigureAwait(true);

            this.Response.Headers.Add("jobId", jobId);

            return jobId;
        }

        private async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid)
        {
            var getServicesBanHistory = this.apolloPlayerDetailsProvider.GetUserBanHistoryAsync(xuid);
            var getLiveOpsBanHistory = this.banHistoryProvider.GetBanHistoriesAsync(xuid, TitleConstants.ApolloCodeName);

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
                return await this.apolloPlayerDetailsProvider.GetPlayerIdentityAsync(query).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                if (ex is ArgumentException)
                {
                    return new IdentityResultAlpha
                    {
                        Error = new IdentityLookupError(StewardErrorCode.RequiredParameterMissing, ex.Message),
                        Query = query
                    };
                }

                if (ex is NotFoundStewardException)
                {
                    return new IdentityResultAlpha
                    {
                        Error = new IdentityLookupError(StewardErrorCode.DocumentNotFound, ex.Message),
                        Query = query
                    };
                }

                throw;
            }
        }

        /// <summary>
        ///     Gets the master inventory list.
        /// </summary>
        /// <returns>
        ///     <see cref="ApolloMasterInventory"/>.
        /// </returns>
        private async Task<ApolloMasterInventory> RetrieveMasterInventoryList()
        {
            var cars = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFM7Cars);
            var vanityItems = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFM7VanityItems);

            await Task.WhenAll(cars, vanityItems).ConfigureAwait(true);

            var masterInventory = new ApolloMasterInventory
            {
                CreditRewards = new List<MasterInventoryItem>
                {
                        new MasterInventoryItem { Id = -1, Description = "Credits" }
                },
                Cars = await cars.ConfigureAwait(true),
                VanityItems = await vanityItems.ConfigureAwait(true),
            };

            return masterInventory;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        /// <param name="gift">The apollo gift.</param>
        /// <returns>
        ///     String of items that are invalid.
        /// </returns>
        private async Task<string> VerifyGiftAgainstMasterInventory(ApolloMasterInventory gift)
        {
            var masterInventoryItem = await this.RetrieveMasterInventoryList().ConfigureAwait(true);
            var error = string.Empty;

            foreach (var car in gift.Cars)
            {
                var validItem = masterInventoryItem.Cars.Any(data => data.Id == car.Id);
                error += validItem ? string.Empty : $"Car: {car.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var vanityItem in gift.VanityItems)
            {
                var validItem = masterInventoryItem.VanityItems.Any(data => data.Id == vanityItem.Id);
                error += validItem ? string.Empty : $"VanityItem: {vanityItem.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            return error;
        }
    }
}
