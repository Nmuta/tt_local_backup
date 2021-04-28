using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Validation.Sunrise
{
    /// <summary>
    ///     Validates a <see cref="SunriseGroupGift"/> request.
    /// </summary>
    public sealed class SunriseGroupGiftRequestValidator : RequestValidatorBase, IRequestValidator<SunriseGroupGift>
    {
        private readonly IRequestValidator<SunriseMasterInventory> masterInventoryRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseGroupGiftRequestValidator"/> class.
        /// </summary>
        public SunriseGroupGiftRequestValidator(IRequestValidator<SunriseMasterInventory> masterInventoryRequestValidator)
        {
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));

            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
        }

        /// <inheritdoc />
        public void Validate(SunriseGroupGift model, ModelStateDictionary modelState)
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
        public void ValidateIds(SunriseGroupGift model, ModelStateDictionary modelState)
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
