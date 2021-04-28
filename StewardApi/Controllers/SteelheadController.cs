﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for steelhead.
    /// </summary>
    [Route("api/v1/title/steelhead")]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "This can't be avoided.")]
    public class SteelheadController : ControllerBase
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 100;
        private const KustoGameDbSupportedTitle Title = KustoGameDbSupportedTitle.Steelhead;

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KeyVaultUrl,
            ConfigurationKeyConstants.GroupGiftPasswordSecretName
        };

        private readonly IMemoryCache memoryCache;
        private readonly ILoggingService loggingService;
        private readonly IKustoProvider kustoProvider;
        private readonly ISteelheadPlayerInventoryProvider steelheadPlayerInventoryProvider;
        private readonly ISteelheadPlayerDetailsProvider steelheadPlayerDetailsProvider;
        private readonly ISteelheadGiftHistoryProvider giftHistoryProvider;
        private readonly ISteelheadBanHistoryProvider banHistoryProvider;
        private readonly IJobTracker jobTracker;
        private readonly IMapper mapper;
        private readonly IScheduler scheduler;
        private readonly IRequestValidator<SteelheadMasterInventory> masterInventoryRequestValidator;
        private readonly IRequestValidator<SteelheadGift> giftRequestValidator;
        private readonly IRequestValidator<SteelheadGroupGift> groupGiftRequestValidator;
        private readonly IRequestValidator<SteelheadBanParametersInput> banParametersRequestValidator;
        private readonly IRequestValidator<SteelheadUserFlagsInput> userFlagsRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadController"/> class.
        /// </summary>
        public SteelheadController(
            IMemoryCache memoryCache,
            ILoggingService loggingService,
            IKustoProvider kustoProvider,
            ISteelheadPlayerDetailsProvider steelheadPlayerDetailsProvider,
            ISteelheadPlayerInventoryProvider steelheadPlayerInventoryProvider,
            IKeyVaultProvider keyVaultProvider,
            ISteelheadGiftHistoryProvider giftHistoryProvider,
            ISteelheadBanHistoryProvider banHistoryProvider,
            IConfiguration configuration,
            IScheduler scheduler,
            IJobTracker jobTracker,
            IMapper mapper,
            IRequestValidator<SteelheadMasterInventory> masterInventoryRequestValidator,
            IRequestValidator<SteelheadGift> giftRequestValidator,
            IRequestValidator<SteelheadGroupGift> groupGiftRequestValidator,
            IRequestValidator<SteelheadBanParametersInput> banParametersRequestValidator,
            IRequestValidator<SteelheadUserFlagsInput> userFlagsRequestValidator)
        {
            memoryCache.ShouldNotBeNull(nameof(memoryCache));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            steelheadPlayerDetailsProvider.ShouldNotBeNull(nameof(steelheadPlayerDetailsProvider));
            steelheadPlayerInventoryProvider.ShouldNotBeNull(nameof(steelheadPlayerInventoryProvider));
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
            userFlagsRequestValidator.ShouldNotBeNull(nameof(userFlagsRequestValidator));
            configuration.ShouldContainSettings(RequiredSettings);

            this.memoryCache = memoryCache;
            this.loggingService = loggingService;
            this.kustoProvider = kustoProvider;
            this.steelheadPlayerDetailsProvider = steelheadPlayerDetailsProvider;
            this.steelheadPlayerInventoryProvider = steelheadPlayerInventoryProvider;
            this.giftHistoryProvider = giftHistoryProvider;
            this.banHistoryProvider = banHistoryProvider;
            this.scheduler = scheduler;
            this.jobTracker = jobTracker;
            this.mapper = mapper;
            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
            this.giftRequestValidator = giftRequestValidator;
            this.groupGiftRequestValidator = groupGiftRequestValidator;
            this.banParametersRequestValidator = banParametersRequestValidator;
            this.userFlagsRequestValidator = userFlagsRequestValidator;
        }

        /// <summary>
        ///     Gets the master inventory data.
        /// </summary>
        [HttpGet("masterInventory")]
        [SwaggerResponse(200, type: typeof(SteelheadMasterInventory))]
        public async Task<IActionResult> GetMasterInventoryList()
        {
            var masterInventory = await this.RetrieveMasterInventoryList().ConfigureAwait(true);
            return this.Ok(masterInventory);
        }

        /// <summary>
        ///     Gets the player identity.
        /// </summary>
        [HttpPost("players/identities")]
        [SwaggerResponse(200, type: typeof(List<IdentityResultAlpha>))]
        [ResponseCache(Duration = CacheSeconds.PlayerIdentity, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetPlayerIdentity([FromBody] IList<IdentityQueryAlpha> identityQueries)
        {
            static string MakeKey(IdentityQueryAlpha identityQuery)
            {
                return $"steelhead:(g:{identityQuery.Gamertag},x:{identityQuery.Xuid})";
            }

            var results = new List<IdentityResultAlpha>();
            var queries = new List<Task<IdentityResultAlpha>>();

            foreach (var query in identityQueries)
            {
                queries.Add(
                    this.memoryCache.GetOrCreateAsync(
                        MakeKey(query),
                        (entry) =>
                        {
                            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(CacheSeconds.PlayerIdentity);
                            return this.RetrieveIdentity(query);
                        }));
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
        [HttpGet("player/gamertag({gamertag})/details")]
        [SwaggerResponse(200, type: typeof(SteelheadPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var playerDetails = await this.steelheadPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);
            if (playerDetails == null)
            {
                return this.NotFound($"Player {gamertag} was not found.");
            }

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        [HttpGet("player/xuid({xuid})/details")]
        [SwaggerResponse(200, type: typeof(SteelheadPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(ulong xuid)
        {
            var playerDetails = await this.steelheadPlayerDetailsProvider.GetPlayerDetailsAsync(xuid).ConfigureAwait(true);
            if (playerDetails == null)
            {
                return this.NotFound($"Player {xuid} was not found.");
            }

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Gets the console details.
        /// </summary>
        [HttpGet("player/xuid({xuid})/consoleDetails")]
        [SwaggerResponse(200, type: typeof(List<ConsoleDetails>))]
        public async Task<IActionResult> GetConsoles(ulong xuid, [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var result = await this.steelheadPlayerDetailsProvider.GetConsolesAsync(xuid, maxResults).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Sets consoles ban status.
        /// </summary>
        [HttpPut("console/consoleId({consoleId})/consoleBanStatus/isBanned({isBanned})")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> SetConsoleBanStatus(ulong consoleId, bool isBanned)
        {
            await this.steelheadPlayerDetailsProvider.SetConsoleBanStatusAsync(consoleId, isBanned).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        [HttpGet("player/xuid({xuid})/sharedConsoleUsers")]
        [SwaggerResponse(200, type: typeof(List<SharedConsoleUser>))]
        public async Task<IActionResult> GetSharedConsoleUsers(ulong xuid, [FromQuery] int startIndex = DefaultStartIndex, [FromQuery] int maxResults = DefaultMaxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var result = await this.steelheadPlayerDetailsProvider.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets user flags.
        /// </summary>
        [HttpGet("player/xuid({xuid})/userFlags")]
        [SwaggerResponse(200, type: typeof(SteelheadUserFlags))]
        public async Task<IActionResult> GetUserFlags(ulong xuid)
        {
            if (!await this.steelheadPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
            {
                return this.NotFound($"No profile found for XUID: {xuid}.");
            }

            var result = await this.steelheadPlayerDetailsProvider.GetUserFlagsAsync(xuid).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Sets user flags.
        /// </summary>
        [HttpPut("player/xuid({xuid})/userFlags")]
        [SwaggerResponse(200, type: typeof(SteelheadUserFlags))]
        public async Task<IActionResult> SetUserFlags(ulong xuid, [FromBody] SteelheadUserFlagsInput userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            this.userFlagsRequestValidator.Validate(userFlags, this.ModelState);
            if (!this.ModelState.IsValid)
            {
                var result = this.userFlagsRequestValidator.GenerateErrorResponse(this.ModelState);
                return this.BadRequest(result);
            }

            if (!await this.steelheadPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
            {
                return this.NotFound($"No profile found for XUID: {xuid}.");
            }

            var validatedFlags = this.mapper.Map<SteelheadUserFlags>(userFlags);
            await this.steelheadPlayerDetailsProvider.SetUserFlagsAsync(xuid, validatedFlags).ConfigureAwait(true);

            var results = await this.steelheadPlayerDetailsProvider.GetUserFlagsAsync(xuid).ConfigureAwait(true);

            return this.Ok(results);
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        [HttpPost("players/ban/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        public async Task<IActionResult> BanPlayersUseBackgroundProcessing(
            [FromBody] IList<SteelheadBanParametersInput> banInput)
        {
            var userClaims = this.User.UserClaims();
            var requestingAgent = userClaims.ObjectId;

            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            banInput.ShouldNotBeNull(nameof(banInput));

            foreach (var banParam in banInput)
            {
                this.banParametersRequestValidator.ValidateIds(banParam, this.ModelState);
                this.banParametersRequestValidator.Validate(banParam, this.ModelState);
            }

            var banParameters = this.mapper.Map<IList<SteelheadBanParameters>>(banInput);

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                return this.BadRequest(result);
            }

            var jobId = await this.AddJobIdToHeaderAsync(banParameters.ToJson(), requestingAgent, $"Steelhead Banning: {banParameters.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var results = await this.steelheadPlayerDetailsProvider.BanUsersAsync(banParameters, requestingAgent).ConfigureAwait(true);

                    await this.jobTracker.UpdateJobAsync(jobId, requestingAgent, BackgroundJobStatus.Completed, results).ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, requestingAgent, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId({jobId})"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        [HttpPost("players/ban")]
        [SwaggerResponse(201, type: typeof(List<BanResult>))]
        [SwaggerResponse(202)]
        public async Task<IActionResult> BanPlayers(
            [FromBody] IList<SteelheadBanParametersInput> banInput)
        {
            var userClaims = this.User.UserClaims();
            var requestingAgent = userClaims.ObjectId;

            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            banInput.ShouldNotBeNull(nameof(banInput));

            foreach (var banParam in banInput)
            {
                this.banParametersRequestValidator.ValidateIds(banParam, this.ModelState);
                this.banParametersRequestValidator.Validate(banParam, this.ModelState);
            }

            var banParameters = this.mapper.Map<IList<SteelheadBanParameters>>(banInput);

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                return this.BadRequest(result);
            }

            var results = await this.steelheadPlayerDetailsProvider.BanUsersAsync(banParameters, requestingAgent).ConfigureAwait(true);

            return this.Ok(results);
        }

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        [HttpPost("players/banSummaries")]
        [SwaggerResponse(200, type: typeof(IList<BanSummary>))]
        public async Task<IActionResult> GetBanSummaries([FromBody] IList<ulong> xuids)
        {
            xuids.ShouldNotBeNull(nameof(xuids));

            var result = await this.steelheadPlayerDetailsProvider.GetUserBanSummariesAsync(xuids).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
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
        [HttpGet("player/gamertag({gamertag})/banHistory")]
        [SwaggerResponse(200, type: typeof(IList<LiveOpsBanHistory>))]
        public async Task<IActionResult> GetBanHistory(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var playerDetails = await this.steelheadPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);

            if (playerDetails == null)
            {
                return this.NotFound($"Player {gamertag} was not found.");
            }

            var result = await this.GetBanHistoryAsync(playerDetails.Xuid).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Get groups.
        /// </summary>
        [HttpGet("groups")]
        [SwaggerResponse(200, type: typeof(IList<LspGroup>))]
        public async Task<IActionResult> GetGroups([FromQuery] int startIndex = DefaultStartIndex, [FromQuery] int maxResults = DefaultMaxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var result = await this.steelheadPlayerDetailsProvider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/xuid({xuid})/inventory")]
        [SwaggerResponse(200, type: typeof(SteelheadMasterInventory))]
        public async Task<IActionResult> GetPlayerInventory(ulong xuid)
        {
            if (!await this.steelheadPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
            {
                return this.NotFound($"No profile found for XUID: {xuid}.");
            }

            var getPlayerInventory = this.steelheadPlayerInventoryProvider.GetPlayerInventoryAsync(xuid);
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
        [HttpGet("player/profileId({profileId})/inventory")]
        [SwaggerResponse(200, type: typeof(SteelheadMasterInventory))]
        public async Task<IActionResult> GetPlayerInventoryByProfileId(int profileId)
        {
            var getPlayerInventory = this.steelheadPlayerInventoryProvider.GetPlayerInventoryAsync(profileId);
            var getMasterInventory = this.RetrieveMasterInventoryList();

            await Task.WhenAll(getPlayerInventory, getMasterInventory).ConfigureAwait(true);

            var playerInventory = await getPlayerInventory.ConfigureAwait(true);
            var masterInventory = await getMasterInventory.ConfigureAwait(true);

            if (playerInventory == null)
            {
                return this.NotFound($"No inventory found for Profile ID: {profileId}.");
            }

            playerInventory = StewardMasterItemHelpers.SetItemDescriptions(playerInventory, masterInventory, this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory profiles.
        /// </summary>
        [HttpGet("player/xuid({xuid})/inventoryProfiles")]
        [SwaggerResponse(200, type: typeof(IList<SteelheadInventoryProfile>))]
        [SwaggerResponse(200)]
        public async Task<IActionResult> GetPlayerInventoryProfiles(ulong xuid)
        {
            var inventoryProfileSummary = await this.steelheadPlayerInventoryProvider.GetInventoryProfilesAsync(xuid).ConfigureAwait(true);

            if (inventoryProfileSummary == null)
            {
                return this.NotFound($"No inventory profiles found for XUID: {xuid}.");
            }

            return this.Ok(inventoryProfileSummary);
        }

        /// <summary>
        ///     Update player inventories with given items.
        /// </summary>
        [HttpPost("gifting/players/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        public async Task<IActionResult> UpdateGroupInventoriesUseBackgroundProcessing([FromBody] SteelheadGroupGift groupGift)
        {
            var userClaims = this.User.UserClaims();
            var requestingAgent = userClaims.ObjectId;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
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
                if (!await this.steelheadPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
                {
                    stringBuilder.Append($"{xuid} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                return this.BadRequest($"Players with XUIDs: {stringBuilder} were not found.");
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventory(groupGift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                return this.BadRequest($"Invalid items found. {invalidItems}");
            }

            var jobId = await this.AddJobIdToHeaderAsync(groupGift.ToJson(), requestingAgent, $"Steelhead Gifting: {groupGift.Xuids.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var allowedToExceedCreditLimit = userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
                    var response = await this.steelheadPlayerInventoryProvider.UpdatePlayerInventoriesAsync(groupGift, requestingAgent, allowedToExceedCreditLimit).ConfigureAwait(true);
                    await this.jobTracker.UpdateJobAsync(jobId, requestingAgent, BackgroundJobStatus.Completed, response).ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, requestingAgent, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId({jobId})"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }

        /// <summary>
        ///     Update player inventories with given items.
        /// </summary>
        [HttpPost("gifting/players")]
        [SwaggerResponse(200, type: typeof(IList<GiftResponse<ulong>>))]
        public async Task<IActionResult> UpdateGroupInventories([FromBody] SteelheadGroupGift groupGift)
        {
            var userClaims = this.User.UserClaims();
            var requestingAgent = userClaims.ObjectId;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
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
                if (!await this.steelheadPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
                {
                    stringBuilder.Append($"{xuid} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                return this.BadRequest($"Players with XUIDs: {stringBuilder} were not found.");
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventory(groupGift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                return this.BadRequest($"Invalid items found. {invalidItems}");
            }

            var allowedToExceedCreditLimit = userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
            var response = await this.steelheadPlayerInventoryProvider.UpdatePlayerInventoriesAsync(groupGift, requestingAgent, allowedToExceedCreditLimit).ConfigureAwait(true);
            return this.Ok(response);
        }

        /// <summary>
        ///     Update inventories for an LSP group.
        /// </summary>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin)]
        [HttpPost("gifting/groupId({groupId})")]
        [SwaggerResponse(200, type: typeof(GiftResponse<int>))]
        public async Task<IActionResult> UpdateGroupInventories(int groupId, [FromBody] SteelheadGift gift)
        {
            var userClaims = this.User.UserClaims();
            var requestingAgent = userClaims.ObjectId;

            gift.ShouldNotBeNull(nameof(gift));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            this.giftRequestValidator.Validate(gift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var result = this.masterInventoryRequestValidator.GenerateErrorResponse(this.ModelState);

                return this.BadRequest(result);
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventory(gift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                return this.BadRequest($"Invalid items found. {invalidItems}");
            }

            var allowedToExceedCreditLimit = userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
            var response = await this.steelheadPlayerInventoryProvider.UpdateGroupInventoriesAsync(groupId, gift, requestingAgent, allowedToExceedCreditLimit).ConfigureAwait(true);
            return this.Ok(response);
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        [HttpGet("player/xuid({xuid})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<SteelheadGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(ulong xuid)
        {
            var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(xuid.ToString(CultureInfo.InvariantCulture), TitleConstants.SteelheadCodeName, GiftIdentityAntecedent.Xuid).ConfigureAwait(true);

            return this.Ok(giftHistory);
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        [HttpGet("group/groupId({groupId})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<SteelheadGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(int groupId)
        {
            var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(groupId.ToString(CultureInfo.InvariantCulture), TitleConstants.SteelheadCodeName, GiftIdentityAntecedent.LspGroupId).ConfigureAwait(true);

            return this.Ok(giftHistory);
        }

        /// <summary>
        ///     Creates a job and puts the job ID in the response header.
        /// </summary>
        private async Task<string> AddJobIdToHeaderAsync(string requestBody, string userObjectId, string reason)
        {
            var jobId = await this.jobTracker.CreateNewJobAsync(requestBody, userObjectId, reason).ConfigureAwait(true);

            this.Response.Headers.Add("jobId", jobId);

            return jobId;
        }

        /// <summary>
        ///     Get ban history.
        /// </summary>
        private async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid)
        {
            var getServicesBanHistory = this.steelheadPlayerDetailsProvider.GetUserBanHistoryAsync(xuid);
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

        /// <summary>
        ///     Retrieve player identity.
        /// </summary>
        private async Task<IdentityResultAlpha> RetrieveIdentity(IdentityQueryAlpha query)
        {
            try
            {
                return await this.steelheadPlayerDetailsProvider.GetPlayerIdentityAsync(query).ConfigureAwait(false);
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
        private async Task<SteelheadMasterInventory> RetrieveMasterInventoryList()
        {
            var cars = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFM8Cars);
            var vanityItems = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFM8VanityItems);

            await Task.WhenAll(cars, vanityItems).ConfigureAwait(true);

            var masterInventory = new SteelheadMasterInventory
            {
                CreditRewards = new List<MasterInventoryItem>
                {
                    new MasterInventoryItem { Id = -1, Description = "Credits" },
                    new MasterInventoryItem { Id = -1, Description = "ForzathonPoints" },
                    new MasterInventoryItem { Id = -1, Description = "SkillPoints" },
                    new MasterInventoryItem { Id = -1, Description = "WheelSpins" },
                    new MasterInventoryItem { Id = -1, Description = "SuperWheelSpins" }
                },
                Cars = await cars.ConfigureAwait(true),
                VanityItems = await vanityItems.ConfigureAwait(true),
            };

            return masterInventory;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        private async Task<string> VerifyGiftAgainstMasterInventory(SteelheadMasterInventory gift)
        {
            var masterInventoryItem = await this.RetrieveMasterInventoryList().ConfigureAwait(true);
            var error = string.Empty;

            foreach (var car in gift.Cars)
            {
                var validItem = masterInventoryItem.Cars.Any(data => { return data.Id == car.Id; });
                error += validItem ? string.Empty : $"Car: {car.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var vanityItem in gift.VanityItems)
            {
                var validItem = masterInventoryItem.VanityItems.Any(data => { return data.Id == vanityItem.Id; });
                error += validItem ? string.Empty : $"VanityItem: {vanityItem.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            return error;
        }
    }
}
