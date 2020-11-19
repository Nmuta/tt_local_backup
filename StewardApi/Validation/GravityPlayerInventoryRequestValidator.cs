using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Validates a <see cref="GravityPlayerInventory"/> request.
    /// </summary>
    public sealed class GravityPlayerInventoryRequestValidator : RequestValidatorBase, IRequestValidator<GravityPlayerInventory>
    {
        /// <inheritdoc />
        public void Validate(GravityPlayerInventory model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (model.Cars != null)
            {
                this.ValidateCars(model.Cars, modelState);
            }

            if (model.MasteryKits != null)
            {
                this.ValidateItemIds(model.MasteryKits.ToList<GravityInventoryItem>(), modelState, nameof(model.MasteryKits));
            }

            if (model.UpgradeKits != null)
            {
                this.ValidateItemIds(model.UpgradeKits.ToList<GravityInventoryItem>(), modelState, nameof(model.UpgradeKits));
            }

            if (model.RepairKits != null)
            {
                this.ValidateItemIds(model.RepairKits.ToList<GravityInventoryItem>(), modelState, nameof(model.RepairKits));
            }

            if (model.EnergyRefills != null)
            {
                this.ValidateItemIds(model.EnergyRefills.ToList<GravityInventoryItem>(), modelState, nameof(model.EnergyRefills));
            }

            if (model.Packs != null)
            {
                this.ValidateItemIds(model.Packs.ToList<GravityInventoryItem>(), modelState, nameof(model.Packs));
            }

            if (model.Currencies != null)
            {
                this.ValidateItemIds(model.Currencies.ToList<GravityInventoryItem>(), modelState, nameof(model.Currencies));
            }
        }

        /// <inheritdoc />
        public void ValidateIds(GravityPlayerInventory model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (model.Xuid == default && string.IsNullOrWhiteSpace(model.Turn10Id))
            {
                modelState.AddModelError($"PlayerInventory.Xuid/T10Id", $"Properties must have one Xuid or T10Id defined. Xuid: {model.Xuid}. T10Id: {model.Turn10Id}.");
            }
        }

        private void ValidateCars(IList<GravityCar> cars, ModelStateDictionary modelState)
        {
            foreach (var car in cars)
            {
                if (car.ItemId < 0)
                {
                    modelState.AddModelError($"PlayerInventory.Cars", $"Property ItemId cannot be negative. {nameof(car.ItemId)} was {car.ItemId}.");
                }

                if (car.Vin == default)
                {
                    modelState.AddModelError($"PlayerInventory.Cars", $"Property Vin cannot be default. {nameof(car.Vin)} was {car.Vin}.");
                }
            }
        }

        private void ValidateItemIds(IList<GravityInventoryItem> items, ModelStateDictionary modelState, string propertyName)
        {
            foreach (var item in items)
            {
                if (item.ItemId < 0)
                {
                    modelState.AddModelError($"PlayerInventory.{propertyName}", $"Property ItemId cannot be negative. {propertyName}.{nameof(item.ItemId)} was {item.ItemId}.");
                }
            }
        }
    }
}
