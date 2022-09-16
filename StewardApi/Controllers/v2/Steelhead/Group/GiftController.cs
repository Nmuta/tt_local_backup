using System;
using System.Globalization;
using System.Linq;
using System.Text;
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
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Validation;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Group
{
    /// <summary>
    ///     Group gift controller.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/group/{groupId}/gift")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.CommunityManager)]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Target.LspGroup, Topic.Gifting)]
    public class GiftController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;

        private readonly ISteelheadItemsProvider itemsProvider;
        private readonly IMapper mapper;
        private readonly ISteelheadPlayerInventoryProvider playerInventoryProvider;
        private readonly IRequestValidator<SteelheadMasterInventory> masterInventoryRequestValidator;
        private readonly IRequestValidator<SteelheadGift> giftRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GiftController"/> class.
        /// </summary>
        public GiftController(
            ISteelheadItemsProvider itemsProvider,
            IMapper mapper,
            ISteelheadPlayerInventoryProvider playerInventoryProvider,
            IRequestValidator<SteelheadMasterInventory> masterInventoryRequestValidator,
            IRequestValidator<SteelheadGift> giftRequestValidator)
        {
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            mapper.ShouldNotBeNull(nameof(mapper));
            playerInventoryProvider.ShouldNotBeNull(nameof(playerInventoryProvider));
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));
            giftRequestValidator.ShouldNotBeNull(nameof(giftRequestValidator));

            this.itemsProvider = itemsProvider;
            this.mapper = mapper;
            this.playerInventoryProvider = playerInventoryProvider;
            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
            this.giftRequestValidator = giftRequestValidator;
        }

        /// <summary>
        ///     Gifts items to a LSP user group.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(GiftResponse<int>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.GroupInventories)]
        public async Task<IActionResult> UpdateGroupInventories(
            int groupId,
            [FromBody] SteelheadGift gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            gift.ShouldNotBeNull(nameof(gift));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

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
            var response = await this.playerInventoryProvider.UpdateGroupInventoriesAsync(
                this.Services,
                groupId,
                gift,
                requesterObjectId,
                allowedToExceedCreditLimit).ConfigureAwait(true);
            return this.Ok(response);
        }

        /// <summary>
        ///     Gifts livery to a LSP user group.
        /// </summary>
        [HttpPost("livery/{liveryId}")]
        [SwaggerResponse(200, type: typeof(GiftResponse<int>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.GroupInventories)]
        public async Task<IActionResult> GiftLiveryToUserGroup(Guid liveryId, int groupId, [FromBody] Gift gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            groupId.ShouldNotBeNull(nameof(groupId));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var livery = await this.Services.StorefrontManagementService.GetUGCLivery(liveryId).ConfigureAwait(true);
            var mappedLivery = this.mapper.Map<UgcItem>(livery);
            if (livery == null)
            {
                throw new InvalidArgumentsStewardException($"Invalid livery id: {liveryId}");
            }

            var response = await this.playerInventoryProvider.SendCarLiveryAsync(this.Services, gift, groupId, mappedLivery, requesterObjectId).ConfigureAwait(true);
            return this.Ok(response);
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        private async Task<string> VerifyGiftAgainstMasterInventoryAsync(SteelheadMasterInventory gift)
        {
            var masterInventoryItem = await this.itemsProvider.GetMasterInventoryAsync().ConfigureAwait(true);
            var error = string.Empty;

            foreach (var car in gift.Cars)
            {
                var validItem = masterInventoryItem.Cars.Any(data => data.Id == car.Id);
                error += validItem
                    ? string.Empty : $"Car: {car.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var vanityItem in gift.VanityItems)
            {
                var validItem = masterInventoryItem.VanityItems.Any(data => data.Id == vanityItem.Id);
                error += validItem
                    ? string.Empty : $"VanityItem: {vanityItem.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            return error;
        }
    }
}
