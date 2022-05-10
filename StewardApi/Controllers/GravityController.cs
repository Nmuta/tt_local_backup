using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
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
        UserRole.SupportAgentNew,
        UserRole.CommunityManager)]
    [LogTagTitle(TitleLogTags.Gravity)]
    public sealed class GravityController : ControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Gravity;

        private readonly IMemoryCache memoryCache;
        private readonly IActionLogger actionLogger;
        private readonly ILoggingService loggingService;
        private readonly IGravityPlayerDetailsProvider gravityPlayerDetailsProvider;
        private readonly IGravityPlayerInventoryProvider gravityPlayerInventoryProvider;
        private readonly IGravityGiftHistoryProvider giftHistoryProvider;
        private readonly IGravityGameSettingsProvider gravityGameSettingsProvider;
        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;
        private readonly IRequestValidator<GravityGift> giftRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityController"/> class.
        /// </summary>
        public GravityController(
            IMemoryCache memoryCache,
            IActionLogger actionLogger,
            ILoggingService loggingService,
            IGravityPlayerDetailsProvider gravityPlayerDetailsProvider,
            IGravityPlayerInventoryProvider gravityPlayerInventoryProvider,
            IGravityGiftHistoryProvider giftHistoryProvider,
            IGravityGameSettingsProvider gravityGameSettingsProvider,
            IScheduler scheduler,
            IJobTracker jobTracker,
            IRequestValidator<GravityGift> giftRequestValidator)
        {
            memoryCache.ShouldNotBeNull(nameof(memoryCache));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            gravityPlayerDetailsProvider.ShouldNotBeNull(nameof(gravityPlayerDetailsProvider));
            gravityPlayerInventoryProvider.ShouldNotBeNull(nameof(gravityPlayerInventoryProvider));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            gravityGameSettingsProvider.ShouldNotBeNull(nameof(gravityGameSettingsProvider));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            giftRequestValidator.ShouldNotBeNull(nameof(giftRequestValidator));

            this.memoryCache = memoryCache;
            this.actionLogger = actionLogger;
            this.loggingService = loggingService;
            this.gravityPlayerDetailsProvider = gravityPlayerDetailsProvider;
            this.gravityPlayerInventoryProvider = gravityPlayerInventoryProvider;
            this.giftHistoryProvider = giftHistoryProvider;
            this.gravityGameSettingsProvider = gravityGameSettingsProvider;
            this.scheduler = scheduler;
            this.jobTracker = jobTracker;
            this.giftRequestValidator = giftRequestValidator;
        }

        /// <summary>
        ///     Gets the player identity.
        /// </summary>
        [HttpPost("players/identities")]
        [SwaggerResponse(200, type: typeof(List<IdentityResultBeta>))]
        [ResponseCache(Duration = CacheSeconds.PlayerIdentity, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetPlayerIdentity([FromBody] IList<IdentityQueryBeta> identityQueries)
        {
            string MakeKey(IdentityQueryBeta identityQuery)
            {
                return GravityCacheKey.MakeIdentityLookupKey(
                    identityQuery.Gamertag,
                    identityQuery.Xuid,
                    identityQuery.T10Id);
            }

            var results = new List<IdentityResultBeta>();
            var queries = new List<Task<IdentityResultBeta>>();

            foreach (var query in identityQueries)
            {
                queries.Add(
                    this.memoryCache.GetOrCreateAsync(
                        MakeKey(query),
                        (entry) =>
                        {
                            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(CacheSeconds.PlayerIdentity);
                            return this.RetrieveIdentityAsync(query);
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
        [SwaggerResponse(200, type: typeof(GravityPlayerDetails))]
        [SwaggerResponse(404, type: typeof(string))]
        public async Task<IActionResult> GetPlayerDetails(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        [HttpGet("player/xuid({xuid})/details")]
        [SwaggerResponse(200, type: typeof(GravityPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(ulong xuid)
        {
            var playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsAsync(xuid).ConfigureAwait(true);

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        [HttpGet("player/t10Id({t10Id})/details")]
        [SwaggerResponse(200, type: typeof(GravityPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetailsByT10Id(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsByT10IdAsync(t10Id).ConfigureAwait(true);

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/xuid({xuid})/inventory")]
        [SwaggerResponse(200, type: typeof(GravityPlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(ulong xuid)
        {
            var playerInventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(xuid).ConfigureAwait(true);
            var masterInventory = await this.gravityGameSettingsProvider.GetGameSettingsAsync(playerInventory.GameSettingsId).ConfigureAwait(true);

            playerInventory.SetItemDescriptions(masterInventory, $"XUID: {xuid}", this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/t10Id({t10Id})/inventory")]
        [SwaggerResponse(200, type: typeof(GravityPlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var playerInventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(t10Id).ConfigureAwait(true);
            var masterInventory = await this.gravityGameSettingsProvider.GetGameSettingsAsync(playerInventory.GameSettingsId).ConfigureAwait(true);

            playerInventory.SetItemDescriptions(masterInventory, $"T10 ID: {t10Id}", this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/xuid({xuid})/profileId({profileId})/inventory")]
        [SwaggerResponse(200, type: typeof(GravityPlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(ulong xuid, string profileId)
        {
            profileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(profileId));

            var playerInventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(xuid, profileId).ConfigureAwait(true);
            var masterInventory = await this.gravityGameSettingsProvider.GetGameSettingsAsync(playerInventory.GameSettingsId).ConfigureAwait(true);

            if (playerInventory == null)
            {
                throw new NotFoundStewardException($"No inventory found for XUID: {xuid}");
            }

            playerInventory.SetItemDescriptions(masterInventory, $"XUID: {xuid}, Profile ID: {profileId}", this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/t10Id({t10Id})/profileId({profileId})/inventory")]
        [SwaggerResponse(200, type: typeof(GravityPlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(string t10Id, string profileId)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            profileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(profileId));

            var playerInventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(t10Id, profileId).ConfigureAwait(true);
            var masterInventory = await this.gravityGameSettingsProvider.GetGameSettingsAsync(playerInventory.GameSettingsId).ConfigureAwait(true);

            if (playerInventory == null)
            {
                throw new NotFoundStewardException($"No inventory found for Turn 10 ID: {t10Id}");
            }

            playerInventory.SetItemDescriptions(masterInventory, $"T10 ID: {t10Id}, Profile ID: {profileId}", this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gift player items to their inventory.
        /// </summary>
        [HttpPost("gifting/t10Id({t10Id})/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerInventory)]
        public async Task<IActionResult> UpdatePlayerInventoryByT10IdUseBackgroundProcessing(
            string t10Id,
            [FromBody] GravityGift gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            gift.ShouldNotBeNull(nameof(gift));
            gift.GiftReason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gift.GiftReason));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            this.giftRequestValidator.Validate(gift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var errorResponse = this.giftRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(errorResponse);
            }

            GravityPlayerDetails playerDetails;
            try
            {
                playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsByT10IdAsync(t10Id).ConfigureAwait(true);
            }
            catch (Exception)
            {
                throw new NotFoundStewardException($"No player found for T10Id: {t10Id}");
            }

            var playerGameSettingsId = playerDetails.LastGameSettingsUsed;
            var invalidItems = await this.VerifyGiftAgainstMasterInventoryAsync(playerGameSettingsId, gift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid items found. {invalidItems}");
            }

            var jobId = await this.AddJobIdToHeaderAsync(gift.ToJson(), requesterObjectId, $"Gravity Gifting to Turn 10 ID: {t10Id}.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var allowedToExceedCreditLimit = userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
                    var response = await this.gravityPlayerInventoryProvider.UpdatePlayerInventoryAsync(t10Id, playerGameSettingsId, gift, requesterObjectId, allowedToExceedCreditLimit).ConfigureAwait(true);

                    var jobStatus = response.Errors?.Count > 0 ?
                        BackgroundJobStatus.CompletedWithErrors :
                        BackgroundJobStatus.Completed;
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response).ConfigureAwait(true);

                    if (response.Errors == null || response.Errors.Count == 0)
                    {
                        await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.T10Id, new List<string> { response.PlayerOrLspGroup })
                            .ConfigureAwait(true);
                    }
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId({jobId})"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }

        /// <summary>
        ///     Gift player items to their inventory.
        /// </summary>
        [HttpPost("gifting/t10Id({t10Id})")]
        [SwaggerResponse(200, type: typeof(GiftResponse<string>))]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerInventory)]
        public async Task<IActionResult> UpdatePlayerInventoryByT10Id(string t10Id, [FromBody] GravityGift gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            gift.ShouldNotBeNull(nameof(gift));
            gift.GiftReason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gift.GiftReason));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            this.giftRequestValidator.Validate(gift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var errorResponse = this.giftRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(errorResponse);
            }

            GravityPlayerDetails playerDetails;
            try
            {
                playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsByT10IdAsync(t10Id).ConfigureAwait(true);

            }
            catch (Exception)
            {
                throw new NotFoundStewardException($"No player found for T10Id: {t10Id}");
            }

            var playerGameSettingsId = playerDetails.LastGameSettingsUsed;
            var invalidItems = await this.VerifyGiftAgainstMasterInventoryAsync(playerGameSettingsId, gift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid items found. {invalidItems}");
            }

            var allowedToExceedCreditLimit = userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
            var response = await this.gravityPlayerInventoryProvider.UpdatePlayerInventoryAsync(t10Id, playerGameSettingsId, gift, requesterObjectId, allowedToExceedCreditLimit).ConfigureAwait(true);

            return this.Ok(response);
        }

        /// <summary>
        ///     Gets the master inventory list based on a game settings id.
        /// </summary>
        [HttpGet("masterInventory/gameSettingsId({gameSettingsId})")]
        [SwaggerResponse(200, type: typeof(GravityMasterInventory))]
        [SwaggerResponse(404, type: typeof(string))]
        public async Task<IActionResult> GetMasterInventoryList(string gameSettingsId)
        {
            gameSettingsId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gameSettingsId));

            if (!Guid.TryParse(gameSettingsId, out var gameSettingsIdGuid))
            {
                throw new InvalidArgumentsStewardException("Game settings ID provided is not a GUID.");
            }

            var masterInventory = await this.gravityGameSettingsProvider.GetGameSettingsAsync(gameSettingsIdGuid).ConfigureAwait(true);

            return this.Ok(masterInventory);
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        [HttpGet("player/t10Id({t10Id})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<GravityGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(
            string t10Id,
            [FromQuery] DateTimeOffset? startDate,
            [FromQuery] DateTimeOffset? endDate)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            if (startDate.HasValue && endDate.HasValue && DateTimeOffset.Compare(startDate.Value, endDate.Value) >= 0)
            {
                throw new BadRequestStewardException("Start date must come before end date: " +
                    $"({nameof(startDate)}: {startDate}) ({nameof(endDate)}: {endDate})");
            }

            var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(
                t10Id,
                TitleConstants.GravityCodeName,
                GiftIdentityAntecedent.T10Id,
                startDate,
                endDate).ConfigureAwait(true);

            return this.Ok(giftHistory);
        }

        private async Task<string> AddJobIdToHeaderAsync(string requestBody, string userObjectId, string reason)
        {
            var jobId = await this.jobTracker.CreateNewJobAsync(requestBody, userObjectId, reason).ConfigureAwait(true);

            this.Response.Headers.Add("jobId", jobId);

            return jobId;
        }

        private async Task<IdentityResultBeta> RetrieveIdentityAsync(IdentityQueryBeta query)
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
                        Error = new InvalidArgumentsStewardError(ex.Message, ex),
                        Query = query
                    };
                }

                if (ex is NotFoundStewardException)
                {
                    return new IdentityResultBeta
                    {
                        Error = new NotFoundStewardError(ex.Message, ex),
                        Query = query
                    };
                }

                throw;
            }
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        private async Task<string> VerifyGiftAgainstMasterInventoryAsync(Guid gameSettingsId, GravityMasterInventory gift)
        {
            var masterInventory = await this.gravityGameSettingsProvider.GetGameSettingsAsync(gameSettingsId).ConfigureAwait(true);
            var error = string.Empty;

            foreach (var reward in gift.CreditRewards ?? Enumerable.Empty<MasterInventoryItem>())
            {
                var validItem = masterInventory.CreditRewards.Any(data => { return data.Id == reward.Id; });
                error += validItem ? string.Empty : $"CreditRewards: {reward.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var car in gift.Cars ?? Enumerable.Empty<MasterInventoryItem>())
            {
                var validItem = masterInventory.Cars.Any(data => { return data.Id == car.Id; });
                error += validItem ? string.Empty : $"Car: {car.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var energyRefill in gift.EnergyRefills ?? Enumerable.Empty<MasterInventoryItem>())
            {
                var validItem = masterInventory.EnergyRefills.Any(data => { return data.Id == energyRefill.Id; });
                error += validItem ? string.Empty : $"EnergyRefills: {energyRefill.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var kit in gift.MasteryKits ?? Enumerable.Empty<MasterInventoryItem>())
            {
                var validItem = masterInventory.MasteryKits.Any(data => { return data.Id == kit.Id; });
                error += validItem ? string.Empty : $"MasteryKits: {kit.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var kit in gift.RepairKits ?? Enumerable.Empty<MasterInventoryItem>())
            {
                var validItem = masterInventory.RepairKits.Any(data => { return data.Id == kit.Id; });
                error += validItem ? string.Empty : $"RepairKits: {kit.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var kit in gift.UpgradeKits ?? Enumerable.Empty<MasterInventoryItem>())
            {
                var validItem = masterInventory.UpgradeKits.Any(data => { return data.Id == kit.Id; });
                error += validItem ? string.Empty : $"UpgradeKits: {kit.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            return error;
        }
    }
}
