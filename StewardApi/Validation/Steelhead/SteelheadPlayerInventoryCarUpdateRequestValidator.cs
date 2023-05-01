using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Validation.Steelhead
{
    /// <summary>
    ///     Validates a list of <see cref="CarInventoryItem"/> items used for inventory update request.
    /// </summary>
    public class SteelheadPlayerInventoryCarUpdateRequestValidator : RequestValidatorBase, IRequestValidator<IList<CarInventoryItem>>
    {
        private readonly ISteelheadPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadPlayerInventoryCarUpdateRequestValidator"/> class.
        /// </summary>
        public SteelheadPlayerInventoryCarUpdateRequestValidator(ISteelheadPegasusService pegasusService)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.pegasusService = pegasusService;
        }

        /// <inheritdoc />
        public void Validate(IList<CarInventoryItem> model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            this.ValidateCarsAsync(model, modelState).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        /// <inheritdoc />
        public void ValidateIds(IList<CarInventoryItem> model, ModelStateDictionary modelState)
        {
            throw new NotImplementedException();
        }

        private async Task ValidateCarsAsync(IList<CarInventoryItem> cars, ModelStateDictionary modelState)
        {
            var pegasusCars = await this.pegasusService.GetCarsAsync().ConfigureAwait(true);
            var stringBuilder = new StringBuilder();

            foreach (var car in cars)
            {
                if (car.CarId <= 0)
                {
                    modelState.AddModelError($"CarInventoryItem.{nameof(car.CarId)}", $"{nameof(car.CarId)} cannot be negative or zero. {nameof(car.CarId)} was {car.CarId}.");
                }

                if (car.PurchasePrice <= 0)
                {
                    modelState.AddModelError($"CarInventoryItem.{nameof(car.PurchasePrice)}", $"{nameof(car.PurchasePrice)} cannot be negative or zero. {nameof(car.PurchasePrice)} was {car.PurchasePrice}.");
                }

                if (!pegasusCars.Where(pegasusCar => pegasusCar.CarId == car.CarId).Any())
                {
                    stringBuilder.Append($"{car.CarId} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                modelState.AddModelError($"Cars", $"Cars with IDs: {stringBuilder} were not found in Pegasus.");
            }
        }
    }
}
