using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Validates a <see cref="SunrisePlayerInventory"/> request.
    /// </summary>
    public sealed class SunrisePlayerInventoryRequestValidator : RequestValidatorBase, IRequestValidator<SunrisePlayerInventory>
    {
        /// <inheritdoc />
        public void Validate(SunrisePlayerInventory model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (model.Credits < 0)
            {
                modelState.AddModelError($"PlayerInventory.Credits", $"Property cannot be negative. {nameof(model.Credits)} was {model.Credits}.");
            }

            if (model.WheelSpins < 0)
            {
                modelState.AddModelError($"PlayerInventory.WheelSpins", $"Property cannot be negative. {nameof(model.WheelSpins)} was {model.WheelSpins}.");
            }

            if (model.SuperWheelSpins < 0)
            {
                modelState.AddModelError($"PlayerInventory.SuperWheelSpins", $"Property cannot be negative. {nameof(model.SuperWheelSpins)} was {model.SuperWheelSpins}.");
            }

            if (model.SkillPoints < 0)
            {
                modelState.AddModelError($"PlayerInventory.SkillPoints", $"Property cannot be negative. {nameof(model.SkillPoints)} was {model.SkillPoints}.");
            }

            if (model.ForzathonPoints < 0)
            {
                modelState.AddModelError($"PlayerInventory.ForzathonPoints", $"Property cannot be negative. {nameof(model.ForzathonPoints)} was {model.ForzathonPoints}.");
            }

            if (model.Cars != null)
            {
                this.ValidateItemIds(model.Cars.ToList<SunriseInventoryItem>(), modelState, nameof(model.Cars));
            }

            if (model.Emotes != null)
            {
                this.ValidateItemIds(model.Emotes.ToList<SunriseInventoryItem>(), modelState, nameof(model.Emotes));
            }

            if (model.CarHorns != null)
            {
                this.ValidateItemIds(model.CarHorns.ToList<SunriseInventoryItem>(), modelState, nameof(model.CarHorns));
            }

            if (model.VanityItems != null)
            {
                this.ValidateItemIds(model.VanityItems.ToList<SunriseInventoryItem>(), modelState, nameof(model.VanityItems));
            }

            if (model.QuickChatLines != null)
            {
                this.ValidateItemIds(model.QuickChatLines.ToList<SunriseInventoryItem>(), modelState, nameof(model.QuickChatLines));
            }
        }

        /// <inheritdoc />
        public void ValidateIds(SunrisePlayerInventory model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            var groupId = modelState["groupId"]?.AttemptedValue;

            if (model.Xuid == default && string.IsNullOrWhiteSpace(groupId))
            {
                modelState.AddModelError($"PlayerInventory.Xuid", $"Property must be supplied. {nameof(model.Xuid)} was {model.Xuid}.");
            }
        }

        private void ValidateItemIds(IList<SunriseInventoryItem> items, ModelStateDictionary modelState, string propertyName)
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
