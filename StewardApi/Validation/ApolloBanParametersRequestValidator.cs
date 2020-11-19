using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Xls.Security.FM7.Generated;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Validates a <see cref="ApolloBanParameters"/> request.
    /// </summary>
    public sealed class ApolloBanParametersRequestValidator : RequestValidatorBase, IRequestValidator<ApolloBanParameters>
    {
        /// <inheritdoc />
        public void Validate(ApolloBanParameters model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (model.ExpireTimeUtc == default)
            {
                modelState.AddModelError("BanParameters.ExpireTimeUtc", $"Property value must be valid DateTime. {nameof(model.ExpireTimeUtc)} was {model.ExpireTimeUtc}.");
            }

            if (model.ExpireTimeUtc < DateTime.UtcNow)
            {
                modelState.AddModelError("BanParameters.ExpireTimeUtc", $"Property value must come before current time.{nameof(model.ExpireTimeUtc)} was {model.ExpireTimeUtc}.");
            }

            if (model.StartTimeUtc >= model.ExpireTimeUtc)
            {
                modelState.AddModelError("BanParameters.ExpireTimeUtc", $"Property value must come after StartTimeUtc. {nameof(model.StartTimeUtc)} was {model.StartTimeUtc}. {nameof(model.ExpireTimeUtc)} was {model.ExpireTimeUtc}.");
            }

            if (model.SendReasonNotification && string.IsNullOrWhiteSpace(model.Reason))
            {
                var reasonStatus = model.Reason == null ? "Null" : "Empty";
                modelState.AddModelError("BanParameters.Reason", $"Property value cannot be null, empty, or whitespace when marked for send. {nameof(model.Reason)} was {reasonStatus}.");
            }

            if (model.FeatureArea == null || !Enum.IsDefined(typeof(FeatureAreas), model.FeatureArea))
            {
                var areaStatus = model.FeatureArea == null ? "Null" : model.FeatureArea;
                modelState.AddModelError("BanParameters.FeatureArea", $"Property must be a valid FeatureArea. {nameof(model.FeatureArea)} was {areaStatus}.");
            }
        }

        /// <inheritdoc />
        public void ValidateIds(ApolloBanParameters model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (model.Xuid == default && string.IsNullOrWhiteSpace(model.Gamertag))
            {
                modelState.AddModelError(
                    "BanParameters.Xuid/BanParameters.Gamertag",
                    $"Properties must have either XUID or Gamertag defined. {nameof(model.Xuid)} was {model.Xuid}. {nameof(model.Gamertag)} was {model.Gamertag}.");
            }
        }
    }
}
