using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;

namespace Turn10.LiveOps.StewardApi.Validation.Steelhead
{
    /// <summary>
    ///     Validates a <see cref="SteelheadPlayerInventory"/> item update request.
    /// </summary>
    public class SteelheadPlayerInventoryItemUpdateRequestValidator : RequestValidatorBase, IRequestValidator<SteelheadPlayerInventory>
    {
        private readonly ISteelheadPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadPlayerInventoryItemUpdateRequestValidator"/> class.
        /// </summary>
        public SteelheadPlayerInventoryItemUpdateRequestValidator(ISteelheadPegasusService pegasusService)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.pegasusService = pegasusService;
        }

        /// <inheritdoc />
        public void Validate(SteelheadPlayerInventory model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            foreach (var creditReward in model.CreditRewards)
            {
                if (creditReward.Quantity <= 0)
                {
                    modelState.AddModelError($"UpdateInventory.{creditReward.Quantity}", $"Property cannot be negative or zero. {nameof(creditReward.Quantity)} was {creditReward.Quantity}.");
                }
            }

            if (model.VanityItems != null)
            {
                this.ValidateItemsAsync(model.VanityItems.ToList(), modelState, nameof(model.VanityItems)).ConfigureAwait(false).GetAwaiter().GetResult();
            }
        }

        /// <inheritdoc />
        public void ValidateIds(SteelheadPlayerInventory model, ModelStateDictionary modelState)
        {
            throw new NotImplementedException();
        }

        private async Task ValidateItemsAsync(IList<PlayerInventoryItem> items, ModelStateDictionary modelState, string propertyName)
        {
            var pegasusVanityItems = await this.pegasusService.GetVanityItemsAsync().ConfigureAwait(false);
            var stringBuilder = new StringBuilder();

            foreach (var item in items)
            {
                if (item.Id <= 0)
                {
                    modelState.AddModelError($"SteelheadPlayerInventory.{propertyName}", $"Item Id cannot be negative or zero. {propertyName}.{nameof(item.Id)} was {item.Id}.");
                }

                if (item.Quantity < 0)
                {
                    modelState.AddModelError($"SteelheadPlayerInventory.{propertyName}", $"Item quantity cannot be negative or zero. {propertyName}.{nameof(item.Id)} was {item.Quantity}.");
                }

                if (!pegasusVanityItems.Where(pegasusVanityItem => pegasusVanityItem.VanityItemId == item.Id).Any())
                {
                    stringBuilder.Append($"{item.Id} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                modelState.AddModelError($"SteelheadPlayerInventory.{propertyName}", $"Vanity Items with IDs: {stringBuilder} were not found in Pegasus.");
            }
        }
    }
}
