﻿using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Validation.Woodstock
{
    /// <summary>
    ///     Validates a <see cref="WoodstockMasterInventory"/> request.
    /// </summary>
    public sealed class WoodstockMasterInventoryRequestValidator : RequestValidatorBase, IRequestValidator<WoodstockMasterInventory>
    {
        /// <inheritdoc />
        public void Validate(WoodstockMasterInventory model, ModelStateDictionary modelState)
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

            if (model.Emotes != null)
            {
                this.ValidateItems(model.Emotes.ToList(), modelState, nameof(model.Emotes));
            }

            if (model.CarHorns != null)
            {
                this.ValidateItems(model.CarHorns.ToList(), modelState, nameof(model.CarHorns));
            }

            if (model.VanityItems != null)
            {
                this.ValidateItems(model.VanityItems.ToList(), modelState, nameof(model.VanityItems));
            }

            if (model.QuickChatLines != null)
            {
                this.ValidateItems(model.QuickChatLines.ToList(), modelState, nameof(model.QuickChatLines));
            }
        }

        /// <inheritdoc />
        public void ValidateIds(WoodstockMasterInventory model, ModelStateDictionary modelState)
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
