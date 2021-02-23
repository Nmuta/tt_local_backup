using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.Authentication;

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
        private readonly IGravityGameSettingsProvider gravityGameSettingsProvider;
        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;
        private readonly IRequestValidator<GravityGift> giftRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityController"/> class.
        /// </summary>
        /// <param name="gravityPlayerDetailsProvider">The Gravity player details provider.</param>
        /// <param name="gravityPlayerInventoryProvider">The Gravity player inventory provider.</param>
        /// <param name="giftHistoryProvider">The gift history provider.</param>
        /// <param name="gravityGameSettingsProvider">The Gravity game settings provider.</param>
        /// <param name="scheduler">The scheduler.</param>
        /// <param name="jobTracker">The job tracker.</param>
        /// <param name="giftRequestValidator">The gift request validator.</param>
        public GravityController(
            IGravityPlayerDetailsProvider gravityPlayerDetailsProvider,
            IGravityPlayerInventoryProvider gravityPlayerInventoryProvider,
            IGravityGiftHistoryProvider giftHistoryProvider,
            IGravityGameSettingsProvider gravityGameSettingsProvider,
            IScheduler scheduler,
            IJobTracker jobTracker,
            IRequestValidator<GravityGift> giftRequestValidator)
        {
            gravityPlayerDetailsProvider.ShouldNotBeNull(nameof(gravityPlayerDetailsProvider));
            gravityPlayerInventoryProvider.ShouldNotBeNull(nameof(gravityPlayerInventoryProvider));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            gravityGameSettingsProvider.ShouldNotBeNull(nameof(gravityGameSettingsProvider));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            giftRequestValidator.ShouldNotBeNull(nameof(giftRequestValidator));

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
        /// <param name="identityQueries">The identity queries.</param>
        /// <returns>
        ///     The list of <see cref="IdentityResultBeta"/>.
        /// </returns>
        [HttpPost("players/identities")]
        [SwaggerResponse(200, type: typeof(List<IdentityResultBeta>))]
        public async Task<IActionResult> GetPlayerIdentity([FromBody] IList<IdentityQueryBeta> identityQueries)
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
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);

            return this.Ok(playerDetails);
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
            var playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsAsync(xuid).ConfigureAwait(true);

            return this.Ok(playerDetails);
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
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsByT10IdAsync(t10Id).ConfigureAwait(true);

            return this.Ok(playerDetails);
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
            var inventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(xuid).ConfigureAwait(true);

            return this.Ok(inventory);
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
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var inventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(t10Id).ConfigureAwait(true);

            return this.Ok(inventory);
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
            profileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(profileId));

            var inventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(xuid, profileId).ConfigureAwait(true);

            if (inventory == null)
            {
                return this.NotFound($"No inventory found for XUID: {xuid}");
            }

            return this.Ok(inventory);
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
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            profileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(profileId));

            var inventory = await this.gravityPlayerInventoryProvider.GetPlayerInventoryAsync(t10Id, profileId).ConfigureAwait(true);

            if (inventory == null)
            {
                return this.NotFound($"No inventory found for Turn 10 ID: {t10Id}");
            }

            return this.Ok(inventory);
        }

        /// <summary>
        ///     Gift player items to their inventory.
        /// </summary>
        /// <param name="t10Id">The T10 Id.</param>
        /// <param name="gift">The gift to send to the player.</param>
        /// <param name="useBackgroundProcessing">Indicates whether to use background processing.</param>
        /// <returns>
        ///     A <see cref="GiftResponse{T}"/>.
        /// </returns>
        [HttpPost("gifting/t10Id({t10Id})")]
        [SwaggerResponse(200, type: typeof(GiftResponse<string>))]
        public async Task<IActionResult> UpdatePlayerInventoryByT10Id(string t10Id, [FromBody] GravityGift gift, [FromQuery] bool useBackgroundProcessing = false)
        {
            var requestingAgent = this.User.HasClaimType(ClaimTypes.Email)
            ? this.User.GetClaimValue(ClaimTypes.Email)
            : this.User.GetClaimValue("http://schemas.microsoft.com/identity/claims/objectidentifier");

            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));
            gift.ShouldNotBeNull(nameof(gift));
            gift.GiftReason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gift.GiftReason));
            gift.Inventory.ShouldNotBeNull(nameof(gift.Inventory));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            this.giftRequestValidator.Validate(gift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var errorResponse = this.giftRequestValidator.GenerateErrorResponse(this.ModelState);
                return this.BadRequest(errorResponse);
            }

            GravityPlayerDetails playerDetails;
            try
            {
                playerDetails = await this.gravityPlayerDetailsProvider.GetPlayerDetailsByT10IdAsync(t10Id).ConfigureAwait(true);
            }
            catch (Exception)
            {
                playerDetails = null;
            }

            if (playerDetails == null)
            {
                return this.NotFound($"No player found for T10Id: {t10Id}");
            }

            var playerGameSettingsId = playerDetails.LastGameSettingsUsed;
            var invalidItems = await this.VerifyGiftAgainstMasterInventory(playerGameSettingsId, gift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                return this.BadRequest($"Invalid items found. {invalidItems}");
            }

            if (!useBackgroundProcessing)
            {
                var response = await this.gravityPlayerInventoryProvider.UpdatePlayerInventoryAsync(t10Id, playerGameSettingsId, gift, requestingAgent).ConfigureAwait(true);
                return this.Ok(response);
            }

            var username = this.User.GetNameIdentifier();
            var jobId = await this.AddJobIdToHeaderAsync(gift.ToJson(), username).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.gravityPlayerInventoryProvider.UpdatePlayerInventoryAsync(t10Id, playerGameSettingsId, gift, requestingAgent).ConfigureAwait(true);
                    await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Completed, response.ToJson()).ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, username, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Accepted(new BackgroundJob()
            {
                JobId = jobId,
                Status = BackgroundJobStatus.InProgress.ToString(),
            });
        }

        /// <summary>
        ///     Get the master inventory list based on a game settings id.
        /// </summary>
        /// <param name="gameSettingsId">The game settings ID.</param>
        /// <returns>
        ///     The <see cref="GravityMasterInventory"/>.
        /// </returns>
        [HttpGet("masterInventory/gameSettingsId({gameSettingsId})")]
        [SwaggerResponse(200, type: typeof(GravityMasterInventory))]
        [SwaggerResponse(404, type: typeof(string))]
        public async Task<IActionResult> GetMasterInventoryList(string gameSettingsId)
        {
            gameSettingsId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gameSettingsId));

            if (!Guid.TryParse(gameSettingsId, out var gameSettingsIdGuid))
            {
                this.BadRequest("Game settings ID provided is not a GUID.");
            }

            var masterInventory = await this.gravityGameSettingsProvider.GetGameSettingsAsync(gameSettingsIdGuid).ConfigureAwait(true);

            return this.Ok(masterInventory);
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
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(t10Id, TitleConstants.GravityCodeName, GiftHistoryAntecedent.T10Id).ConfigureAwait(true);

            return this.Ok(giftHistory);
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
                        Error = new IdentityLookupError(StewardErrorCode.RequiredParameterMissing, ex.Message),
                        Query = query
                    };
                }

                if (ex is NotFoundStewardException)
                {
                    return new IdentityResultBeta
                    {
                        Error = new IdentityLookupError(StewardErrorCode.DocumentNotFound, ex.Message),
                        Query = query
                    };
                }

                throw;
            }
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        /// <param name="gameSettingsId">The game settings Id.</param>
        /// <param name="gift">The gravity gift.</param>
        /// <returns>
        ///     String of items that are invalid.
        /// </returns>
        private async Task<string> VerifyGiftAgainstMasterInventory(Guid gameSettingsId, GravityMasterInventory gift)
        {
            var masterInventory = await this.gravityGameSettingsProvider.GetGameSettingsAsync(gameSettingsId).ConfigureAwait(true);
            var error = string.Empty;

            foreach (var reward in gift.CreditRewards)
            {
                var validItem = masterInventory.CreditRewards.Any(data => { return data.Id == reward.Id; });
                error += validItem ? string.Empty : $"CreditRewards: {reward.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var car in gift.Cars)
            {
                var validItem = masterInventory.Cars.Any(data => { return data.Id == car.Id; });
                error += validItem ? string.Empty : $"Car: {car.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var energyRefill in gift.EnergyRefills)
            {
                var validItem = masterInventory.EnergyRefills.Any(data => { return data.Id == energyRefill.Id; });
                error += validItem ? string.Empty : $"EnergyRefills: {energyRefill.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var kit in gift.MasteryKits)
            {
                var validItem = masterInventory.MasteryKits.Any(data => { return data.Id == kit.Id; });
                error += validItem ? string.Empty : $"MasteryKits: {kit.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var kit in gift.RepairKits)
            {
                var validItem = masterInventory.RepairKits.Any(data => { return data.Id == kit.Id; });
                error += validItem ? string.Empty : $"RepairKits: {kit.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var kit in gift.UpgradeKits)
            {
                var validItem = masterInventory.UpgradeKits.Any(data => { return data.Id == kit.Id; });
                error += validItem ? string.Empty : $"UpgradeKits: {kit.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            return error;
        }
    }
}
