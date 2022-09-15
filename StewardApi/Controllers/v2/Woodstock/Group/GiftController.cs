﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Bond;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.SystemFunctions;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using static Turn10.Services.LiveOps.FH5_main.Generated.StorefrontManagementService;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Group
{
    /// <summary>
    ///     Controller for woodstock user group gifting.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/group/{groupId}/gift")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock, Target.LspGroup, Topic.Gifting)]
    public class GiftController : V2WoodstockControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        private readonly IMapper mapper;
        private readonly IWoodstockPlayerInventoryProvider playerInventoryProvider;
        private readonly IWoodstockItemsProvider itemsProvider;
        private readonly IRequestValidator<WoodstockGift> giftRequestValidator;
        private readonly IRequestValidator<WoodstockMasterInventory> masterInventoryRequestValidator;
        private readonly IWoodstockPlayerInventoryProvider woodstockPlayerInventoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GiftController"/> class.
        /// </summary>
        public GiftController(
            IMapper mapper,
            IWoodstockPlayerInventoryProvider playerInventoryProvider,
            IWoodstockItemsProvider itemsProvider,
            IRequestValidator<WoodstockGift> giftRequestValidator,
            IRequestValidator<WoodstockMasterInventory> masterInventoryRequestValidator,
            IWoodstockPlayerInventoryProvider woodstockPlayerInventoryProvider)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            playerInventoryProvider.ShouldNotBeNull(nameof(playerInventoryProvider));
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            giftRequestValidator.ShouldNotBeNull(nameof(giftRequestValidator));
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));
            woodstockPlayerInventoryProvider.ShouldNotBeNull(nameof(woodstockPlayerInventoryProvider));

            this.mapper = mapper;
            this.playerInventoryProvider = playerInventoryProvider;
            this.itemsProvider = itemsProvider;
            this.giftRequestValidator = giftRequestValidator;
            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
            this.woodstockPlayerInventoryProvider = woodstockPlayerInventoryProvider;
        }

        /// <summary>
        ///     Gifts items to a user group.
        /// </summary>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [HttpPost]
        [SwaggerResponse(200, type: typeof(GiftResponse<int>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.GroupInventories)]
        public async Task<IActionResult> GiftItemsToUserGroup(int groupId, [FromBody] WoodstockGift gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            gift.ShouldNotBeNull(nameof(gift));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var endpoint = this.WoodstockEndpoint.Value;
            this.giftRequestValidator.Validate(gift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var result = this.masterInventoryRequestValidator.GenerateErrorResponse(this.ModelState);

                throw new InvalidArgumentsStewardException(result);
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventoryAsync(gift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid items found. {invalidItems}");
            }

            var allowedToExceedCreditLimit =
                userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
            var response = await this.woodstockPlayerInventoryProvider.UpdateGroupInventoriesAsync(
                groupId,
                gift,
                requesterObjectId,
                allowedToExceedCreditLimit,
                endpoint).ConfigureAwait(true);
            return this.Ok(response);
        }

        /// <summary>
        ///     Gifts liveries to user group.
        /// </summary>
        [HttpPost("livery")]
        [SwaggerResponse(200, type: typeof(GiftResponse<int>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerInventories)]
        public async Task<IActionResult> GiftLiveryToUserGroup(int groupId, [FromBody] BulkLiveryGift<Gift> gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            var endpoint = this.WoodstockEndpoint.Value;

            gift.ShouldNotBeNull(nameof(gift));
            groupId.ShouldNotBeNull(nameof(groupId));
            gift.Target.GiftReason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gift.Target.GiftReason));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var liveries = await this.LookupLiveries(gift.LiveryIds).ConfigureAwait(true);

            // TODO: Move livery gifting logic out of the provider
            var jobs = liveries.Select(livery => this.playerInventoryProvider.SendCarLiveryAsync(gift.Target, groupId, livery, requesterObjectId, endpoint)).ToList();
            await Task.WhenAll(jobs).ConfigureAwait(false);

            var responses = jobs.Select(j => j.GetAwaiter().GetResult()).ToList();
            var response = responses.MergeGiftResponse();

            return this.Ok(response);
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

            try
            {
                livery = await this.Services.StorefrontManagement.GetUGCLivery(liveryGuid).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get livery. (liveryId: {liveryId})", ex);
            }

            if (livery == null)
            {
                throw new InvalidArgumentsStewardException($"Livery not found: {liveryId}");
            }

            var mappedLivery = this.mapper.SafeMap<UgcLiveryItem>(livery.result);
            return mappedLivery;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        private async Task<string> VerifyGiftAgainstMasterInventoryAsync(WoodstockMasterInventory gift)
        {
            var masterInventoryItem = await this.itemsProvider.GetMasterInventoryAsync().ConfigureAwait(true);
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
