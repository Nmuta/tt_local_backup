using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Validation.Woodstock
{
    /// <summary>
    ///     Validates a <see cref="WoodstockGroupGift"/> request.
    /// </summary>
    public sealed class WoodstockGroupGiftRequestValidator : RequestValidatorBase, IRequestValidator<WoodstockGroupGift>
    {
        private readonly IRequestValidator<WoodstockMasterInventory> masterInventoryRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockGroupGiftRequestValidator"/> class.
        /// </summary>
        public WoodstockGroupGiftRequestValidator(IRequestValidator<WoodstockMasterInventory> masterInventoryRequestValidator)
        {
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));

            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
        }

        /// <inheritdoc />
        public void Validate(WoodstockGroupGift model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (string.IsNullOrEmpty(model.GiftReason))
            {
                modelState.AddModelError("Gift.GiftReason", $"Property {nameof(model.GiftReason)} was not supplied.");
            }

            if (model.Inventory == null)
            {
                modelState.AddModelError("GroupGift.GiftInventory", $"Property {nameof(model.Inventory)} was not supplied.");
            }
            else
            {
                this.masterInventoryRequestValidator.Validate(model.Inventory, modelState);
            }
        }

        /// <inheritdoc />
        public void ValidateIds(WoodstockGroupGift model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (model.Xuids == null || !model.Xuids.Any())
            {
                var xuidStatus = model.Xuids == null ? "Null" : "Empty";

                modelState.AddModelError(
                    "GroupGift.Xuids",
                    $"Properties must have at least one xuid or gamertag. {nameof(model.Xuids)} was {xuidStatus}.");
            }
        }
    }
}
