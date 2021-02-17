using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Validates a <see cref="SunriseMasterInventory"/> request.
    /// </summary>
    public sealed class SunriseMasterInventoryRequestValidator : RequestValidatorBase, IRequestValidator<SunriseMasterInventory>
    {
        /// <inheritdoc />
        public void Validate(SunriseMasterInventory model, ModelStateDictionary modelState)
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
                this.ValidateItems(model.Cars.ToList<MasterInventoryItem>(), modelState, nameof(model.Cars));
            }

            if (model.Emotes != null)
            {
                this.ValidateItems(model.Emotes.ToList<MasterInventoryItem>(), modelState, nameof(model.Emotes));
            }

            if (model.CarHorns != null)
            {
                this.ValidateItems(model.CarHorns.ToList<MasterInventoryItem>(), modelState, nameof(model.CarHorns));
            }

            if (model.VanityItems != null)
            {
                this.ValidateItems(model.VanityItems.ToList<MasterInventoryItem>(), modelState, nameof(model.VanityItems));
            }

            if (model.QuickChatLines != null)
            {
                this.ValidateItems(model.QuickChatLines.ToList<MasterInventoryItem>(), modelState, nameof(model.QuickChatLines));
            }
        }

        /// <inheritdoc />
        public void ValidateIds(SunriseMasterInventory model, ModelStateDictionary modelState)
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
