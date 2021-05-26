using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardApi.Validation.Steelhead
{
    /// <summary>
    ///     Validates a <see cref="SteelheadMasterInventory"/> request.
    /// </summary>
    public sealed class SteelheadMasterInventoryRequestValidator : RequestValidatorBase, IRequestValidator<SteelheadMasterInventory>
    {
        /// <inheritdoc />
        public void Validate(SteelheadMasterInventory model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            foreach (var creditReward in model.CreditRewards)
            {
                if (creditReward.Quantity < 0)
                {
                    modelState.AddModelError($"GiftInventory.{creditReward.Description}", $"Property cannot be negative. {nameof(creditReward.Description)} was {creditReward.Description}.");
                }
            }

            if (model.Cars != null)
            {
                this.ValidateItems(model.Cars.ToList(), modelState, nameof(model.Cars));
            }

            if (model.VanityItems != null)
            {
                this.ValidateItems(model.VanityItems.ToList(), modelState, nameof(model.VanityItems));
            }
        }

        /// <inheritdoc />
        public void ValidateIds(SteelheadMasterInventory model, ModelStateDictionary modelState)
        {
            throw new NotImplementedException();
        }

        private void ValidateItems(IList<MasterInventoryItem> items, ModelStateDictionary modelState, string propertyName)
        {
            foreach (var item in items)
            {
                if (item.Id < 0)
                {
                    modelState.AddModelError($"GiftInventory.{propertyName}", $"Item Id cannot be negative. {propertyName}.{nameof(item.Id)} was {item.Id}.");
                }

                if (item.Quantity < 0)
                {
                    modelState.AddModelError($"GiftInventory.{propertyName}", $"Item quantity cannot be negative. {propertyName}.{nameof(item.Id)} was {item.Quantity}.");
                }
            }
        }
    }
}
