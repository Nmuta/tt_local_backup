using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Linq;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;

namespace Turn10.LiveOps.StewardApi.Validation.Apollo
{
    /// <summary>
    ///     Validates a <see cref="ApolloGroupGift"/> request.
    /// </summary>
    public sealed class ApolloGroupGiftRequestValidator : RequestValidatorBase, IRequestValidator<ApolloGroupGift>
    {
        private readonly IRequestValidator<ApolloMasterInventory> masterInventoryRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloGroupGiftRequestValidator"/> class.
        /// </summary>
        public ApolloGroupGiftRequestValidator(IRequestValidator<ApolloMasterInventory> masterInventoryRequestValidator)
        {
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));

            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
        }

        /// <inheritdoc />
        public void Validate(ApolloGroupGift model, ModelStateDictionary modelState)
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
        public void ValidateIds(ApolloGroupGift model, ModelStateDictionary modelState)
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
