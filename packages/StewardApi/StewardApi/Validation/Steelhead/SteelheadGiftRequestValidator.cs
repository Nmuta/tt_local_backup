using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardApi.Validation.Steelhead
{
    /// <summary>
    ///     Validates a <see cref="SteelheadGift"/> request.
    /// </summary>
    public sealed class SteelheadGiftRequestValidator : RequestValidatorBase, IRequestValidator<SteelheadGift>
    {
        private readonly IRequestValidator<SteelheadMasterInventory> masterInventoryRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadGiftRequestValidator"/> class.
        /// </summary>
        public SteelheadGiftRequestValidator(IRequestValidator<SteelheadMasterInventory> masterInventoryRequestValidator)
        {
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));

            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
        }

        /// <inheritdoc />
        public void Validate(SteelheadGift model, ModelStateDictionary modelState)
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
        public void ValidateIds(SteelheadGift model, ModelStateDictionary modelState)
        {
            throw new NotImplementedException();
        }
    }
}
