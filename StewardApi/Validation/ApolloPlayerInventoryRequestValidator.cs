using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Validates a <see cref="ApolloPlayerInventory"/> request.
    /// </summary>
    public sealed class ApolloPlayerInventoryRequestValidator : RequestValidatorBase, IRequestValidator<ApolloPlayerInventory>
    {
        /// <inheritdoc />
        public void Validate(ApolloPlayerInventory model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (model.Credits < 0)
            {
                modelState.AddModelError($"PlayerInventory.Credits", $"Property cannot be negative. {nameof(model.Credits)} was {model.Credits}.");
            }

            if (model.Cars != null)
            {
                this.ValidateItemIds(model.Cars.ToList<ApolloInventoryItem>(), modelState, nameof(model.Cars));
            }

            if (model.VanityItems != null)
            {
                this.ValidateItemIds(model.VanityItems.ToList<ApolloInventoryItem>(), modelState, nameof(model.VanityItems));
            }
        }

        /// <inheritdoc />
        public void ValidateIds(ApolloPlayerInventory model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            var groupId = modelState["groupId"]?.AttemptedValue;

            if (model.Xuid == default && string.IsNullOrWhiteSpace(groupId))
            {
                modelState.AddModelError($"PlayerInventory.Xuid", $"Property must be supplied. {nameof(model.Xuid)} was {model.Xuid}.");
            }
        }

        private void ValidateItemIds(IList<ApolloInventoryItem> items, ModelStateDictionary modelState, string propertyName)
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
