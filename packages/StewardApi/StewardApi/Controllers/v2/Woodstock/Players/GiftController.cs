﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Validation;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using static Turn10.Services.LiveOps.FH5_main.Generated.StorefrontManagementService;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Players
{
    /// <summary>
    ///     Controller for woodstock multiple-player gifting.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/players/gift")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Players, Topic.Gifting)]
    public class GiftController : V2WoodstockControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        private readonly IWoodstockItemsProvider itemsProvider;
        private readonly IActionLogger actionLogger;
        private readonly IJobTracker jobTracker;
        private readonly ILoggingService loggingService;
        private readonly IScheduler scheduler;
        private readonly IMapper mapper;
        private readonly IStewardUserProvider userProvider;
        private readonly IWoodstockPlayerInventoryProvider playerInventoryProvider;
        private readonly IRequestValidator<WoodstockMasterInventory> masterInventoryRequestValidator;
        private readonly IRequestValidator<WoodstockGift> giftRequestValidator;
        private readonly IRequestValidator<WoodstockGroupGift> groupGiftRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GiftController"/> class.
        /// </summary>
        public GiftController(
            IWoodstockItemsProvider itemsProvider,
            IActionLogger actionLogger,
            IJobTracker jobTracker,
            ILoggingService loggingService,
            IScheduler scheduler,
            IMapper mapper,
            IStewardUserProvider userProvider,
            IWoodstockPlayerInventoryProvider playerInventoryProvider,
            IRequestValidator<WoodstockMasterInventory> masterInventoryRequestValidator,
            IRequestValidator<WoodstockGift> giftRequestValidator,
            IRequestValidator<WoodstockGroupGift> groupGiftRequestValidator)
        {
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            mapper.ShouldNotBeNull(nameof(mapper));
            userProvider.ShouldNotBeNull(nameof(userProvider));
            playerInventoryProvider.ShouldNotBeNull(nameof(playerInventoryProvider));
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));
            giftRequestValidator.ShouldNotBeNull(nameof(giftRequestValidator));
            groupGiftRequestValidator.ShouldNotBeNull(nameof(groupGiftRequestValidator));

            this.itemsProvider = itemsProvider;
            this.actionLogger = actionLogger;
            this.jobTracker = jobTracker;
            this.loggingService = loggingService;
            this.scheduler = scheduler;
            this.mapper = mapper;
            this.userProvider = userProvider;
            this.playerInventoryProvider = playerInventoryProvider;
            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
            this.giftRequestValidator = giftRequestValidator;
            this.groupGiftRequestValidator = groupGiftRequestValidator;
        }

        /// <summary>
        ///    Gifts items to player using background job processing.
        /// </summary>
        [HttpPost("useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Kusto | DependencyLogTags.BackgroundProcessing)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerInventories)]
        [Authorize(Policy = UserAttributeValues.GiftPlayer)]
        public async Task<IActionResult> GiftItemsToPlayersUseBackgroundProcessing(
            [FromBody] WoodstockGroupGift groupGift)
        {
            var services = this.Services;
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            var endpoint = this.WoodstockEndpoint.Value;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            groupGift.Xuids.EnsureValidXuids();

            var proxyBundle = this.Services;

            await proxyBundle.EnsurePlayersExistAsync(groupGift.Xuids).ConfigureAwait(true);

            this.groupGiftRequestValidator.ValidateIds(groupGift, this.ModelState);
            this.groupGiftRequestValidator.Validate(groupGift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var errorResponse = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(errorResponse);
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventoryAsync(groupGift.Inventory)
                .ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid items found. {invalidItems}");
            }

            var jobId = await this.jobTracker.CreateNewJobAsync(
                groupGift.ToJson(),
                requesterObjectId,
                $"Woodstock Gifting: {groupGift.Xuids.Count} recipients.",
                this.Response).ConfigureAwait(true);

            var hasPermissionsToExceedCreditLimit = await this.userProvider.HasPermissionsForAsync(this.HttpContext, requesterObjectId, UserAttributeValues.AllowedToExceedGiftingCreditLimit).ConfigureAwait(false);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    // Before refactoring, please check the repo ReadMe -> Steward -> Docs -> Background Jobs and Race Conditions
                    var response = await this.playerInventoryProvider.UpdatePlayerInventoriesAsync(
                        groupGift,
                        requesterObjectId,
                        hasPermissionsToExceedCreditLimit,
                        proxyBundle).ConfigureAwait(true);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response)
                        .ConfigureAwait(true);

                    var giftedXuids = response.Select(successfulResponse => Invariant($"{successfulResponse.PlayerOrLspGroup}")).ToList();

                    await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, giftedXuids)
                        .ConfigureAwait(true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Background job failed {jobId}", ex));

                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed)
                        .ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId({jobId})"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }

        /// <summary>
        ///     Gifts livery to players using background job processing.
        /// </summary>
        [HttpPost("livery/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto | DependencyLogTags.BackgroundProcessing)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerInventories)]
        [Authorize(Policy = UserAttributeValues.GiftPlayer)]
        public async Task<IActionResult> GiftLiveryToPlayersUseBackgroundProcessing([FromBody] BulkLiveryGift<ExpirableGroupGift> gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            var endpoint = this.WoodstockEndpoint.Value;

            var groupGift = gift.Target;
            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Xuids.EnsureValidXuids();
            groupGift.GiftReason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(groupGift.GiftReason));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var proxyBundle = this.Services;

            await proxyBundle.EnsurePlayersExistAsync(groupGift.Xuids).ConfigureAwait(true);

            var liveries = await this.LookupLiveries(gift.LiveryIds).ConfigureAwait(true);

            var jobId = await this.jobTracker.CreateNewJobAsync(groupGift.ToJson(), requesterObjectId, $"Woodstock Gifting Liveries: {groupGift.Xuids.Count} recipients.", this.Response).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    // When replacing the player inventory provider, be careful of race conditions
                    var jobs = liveries.Select(livery => this.playerInventoryProvider.SendCarLiveryAsync(groupGift, livery, requesterObjectId, proxyBundle)).ToList();
                    await Task.WhenAll(jobs).ConfigureAwait(false);

                    var responses = jobs.Select(j => j.GetAwaiter().GetResult()).ToList();
                    var collapsedResponses = BackgroundJobHelpers.MergeResponses(responses);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(collapsedResponses);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, collapsedResponses).ConfigureAwait(true);

                    var giftedXuids = collapsedResponses.Select(successfulResponse => Invariant($"{successfulResponse.PlayerOrLspGroup}")).ToList();

                    await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, giftedXuids)
                        .ConfigureAwait(true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Background job failed {jobId}", ex));

                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId({jobId})"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }

        private async Task<IEnumerable<UgcItem>> LookupLiveries(IEnumerable<string> liveryIds)
        {
            var lookups = liveryIds.Select(this.LookupLivery).ToList();
            await Task.WhenAll(lookups).ConfigureAwait(false);
            var results = lookups.Select(v => v.GetAwaiter().GetResult());
            return results;
        }

        private async Task<UgcItem> LookupLivery(string liveryId)
        {
            if (!Guid.TryParse(liveryId, out var liveryGuid))
            {
                throw new InvalidArgumentsStewardException($"Invalid livery id: {liveryId}");
            }

            GetUGCLiveryOutput livery;

            livery = await this.Services.StorefrontManagementService.GetUGCLivery(liveryGuid).ConfigureAwait(true);

            if (livery == null)
            {
                throw new InvalidArgumentsStewardException($"Livery not found: {liveryId}");
            }

            var mappedLivery = this.mapper.SafeMap<WoodstockUgcLiveryItem>(livery.result);
            return mappedLivery;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        private async Task<string> VerifyGiftAgainstMasterInventoryAsync(WoodstockMasterInventory gift)
        {
            var masterInventoryItem = await this.itemsProvider.GetMasterInventoryAsync(WoodstockPegasusSlot.LiveSteward).ConfigureAwait(true);
            var error = string.Empty;

            foreach (var car in gift.Cars)
            {
                var validItem = masterInventoryItem.Cars.Any(data => data.Id == car.Id);
                error += validItem
                    ? string.Empty : $"Car: {car.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var carHorn in gift.CarHorns)
            {
                var validItem = masterInventoryItem.CarHorns.Any(data => data.Id == carHorn.Id);
                error += validItem
                    ? string.Empty : $"CarHorn: {carHorn.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var vanityItem in gift.VanityItems)
            {
                var validItem = masterInventoryItem.VanityItems.Any(data => data.Id == vanityItem.Id);
                error += validItem
                    ? string.Empty : $"VanityItem: {vanityItem.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var emote in gift.Emotes)
            {
                var validItem = masterInventoryItem.Emotes.Any(data => data.Id == emote.Id);
                error += validItem ? string.Empty : $"Emote: {emote.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var quickChatLine in gift.QuickChatLines)
            {
                var validItem = masterInventoryItem.QuickChatLines.Any(data => data.Id == quickChatLine.Id);
                error += validItem
                    ? string.Empty : $"QuickChatLine: {quickChatLine.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            return error;
        }
    }
}
