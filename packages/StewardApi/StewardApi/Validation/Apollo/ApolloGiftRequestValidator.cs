using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;

namespace Turn10.LiveOps.StewardApi.Validation.Apollo
{
    /// <summary>
    ///     Validates a <see cref="ApolloGift"/> request.
    /// </summary>
    public sealed class ApolloGiftRequestValidator : RequestValidatorBase, IRequestValidator<ApolloGift>
    {
        private readonly IRequestValidator<ApolloMasterInventory> masterInventoryRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloGiftRequestValidator"/> class.
        /// </summary>
        public ApolloGiftRequestValidator(IRequestValidator<ApolloMasterInventory> masterInventoryRequestValidator)
        {
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));

            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
        }

        /// <inheritdoc />
        public void Validate(ApolloGift model, ModelStateDictionary modelState)
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
        public void ValidateIds(ApolloGift model, ModelStateDictionary modelState)
        {
            throw new NotImplementedException();
        }
    }
}
