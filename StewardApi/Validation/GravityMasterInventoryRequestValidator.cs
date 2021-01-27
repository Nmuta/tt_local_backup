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
    public sealed class GravityMAsterInventoryRequestValidator : RequestValidatorBase, IRequestValidator<GravityMasterInventory>
    {
        /// <inheritdoc />
        public void Validate(GravityMasterInventory model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (model.Cars != null)
            {
                this.ValidateItemIds(model.Cars.ToList<MasterInventoryItem>(), modelState, nameof(model.MasteryKits));
            }

            if (model.MasteryKits != null)
            {
                this.ValidateItemIds(model.MasteryKits.ToList<MasterInventoryItem>(), modelState, nameof(model.MasteryKits));
            }

            if (model.UpgradeKits != null)
            {
                this.ValidateItemIds(model.UpgradeKits.ToList<MasterInventoryItem>(), modelState, nameof(model.UpgradeKits));
            }

            if (model.RepairKits != null)
            {
                this.ValidateItemIds(model.RepairKits.ToList<MasterInventoryItem>(), modelState, nameof(model.RepairKits));
            }

            if (model.EnergyRefills != null)
            {
                this.ValidateItemIds(model.EnergyRefills.ToList<MasterInventoryItem>(), modelState, nameof(model.EnergyRefills));
            }

            if (model.Currencies != null)
            {
                this.ValidateItemIds(model.Currencies.ToList<MasterInventoryItem>(), modelState, nameof(model.Currencies));
            }
        }

        /// <inheritdoc />
        public void ValidateIds(GravityMasterInventory model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (string.IsNullOrWhiteSpace(model.T10Id))
            {
                modelState.AddModelError($"GravityMasterInventory.T10Id", $"Properties must have a T10Id defined. T10Id: {model.T10Id}.");
            }
        }

        private void ValidateItemIds(IList<MasterInventoryItem> items, ModelStateDictionary modelState, string propertyName)
        {
            foreach (var item in items)
            {
                if (item.Id < 0)
                {
                    modelState.AddModelError($"GravityMasterInventory.{propertyName}", $"Property ItemId cannot be negative. {propertyName}.{nameof(item.Id)} was {item.Id}.");
                }
            }
        }
    }
}
