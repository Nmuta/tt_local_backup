using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Validation.Woodstock
{
    /// <summary>
    ///     Validates a <see cref="WoodstockGift"/> request.
    /// </summary>
    public sealed class WoodstockGiftRequestValidator : RequestValidatorBase, IRequestValidator<WoodstockGift>
    {
        private readonly IRequestValidator<WoodstockMasterInventory> masterInventoryRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockGiftRequestValidator"/> class.
        /// </summary>
        public WoodstockGiftRequestValidator(IRequestValidator<WoodstockMasterInventory> masterInventoryRequestValidator)
        {
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));

            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
        }

        /// <inheritdoc />
        public void Validate(WoodstockGift model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (string.IsNullOrEmpty(model.GiftReason))
            {
                modelState.AddModelError("Gift.GiftReason", $"Property {nameof(model.GiftReason)} was not supplied.");
            }

            if (model.Inventory == null)
            {
                modelState.AddModelError("Gift.GiftInventory", $"Property {nameof(model.Inventory)} was not supplied.");
            }
            else
            {
                this.masterInventoryRequestValidator.Validate(model.Inventory, modelState);
            }
        }

        /// <inheritdoc />
        public void ValidateIds(WoodstockGift model, ModelStateDictionary modelState)
        {
            throw new NotImplementedException();
        }
    }
}
