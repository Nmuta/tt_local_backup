using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Validates a <see cref="GravityMasterInventory"/> request.
    /// </summary>
    public sealed class GravityMasterInventoryRequestValidator : RequestValidatorBase, IRequestValidator<GravityMasterInventory>
    {
        /// <inheritdoc />
        public void Validate(GravityMasterInventory model, ModelStateDictionary modelState)
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

            if (model.MasteryKits != null)
            {
                this.ValidateItems(model.MasteryKits.ToList(), modelState, nameof(model.MasteryKits));
            }

            if (model.UpgradeKits != null)
            {
                this.ValidateItems(model.UpgradeKits.ToList(), modelState, nameof(model.UpgradeKits));
            }

            if (model.RepairKits != null)
            {
                this.ValidateItems(model.RepairKits.ToList(), modelState, nameof(model.RepairKits));
            }

            if (model.EnergyRefills != null)
            {
                this.ValidateItems(model.EnergyRefills.ToList(), modelState, nameof(model.EnergyRefills));
            }
    }

        /// <inheritdoc />
        public void ValidateIds(GravityMasterInventory model, ModelStateDictionary modelState)
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
