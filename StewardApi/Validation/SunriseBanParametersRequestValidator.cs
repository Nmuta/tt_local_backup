using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Xls.Security.FH4.master.Generated;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Validates a <see cref="SunriseBanParameters"/> request.
    /// </summary>
    public sealed class SunriseBanParametersRequestValidator : RequestValidatorBase, IRequestValidator<SunriseBanParameters>
    {
        /// <inheritdoc />
        public void Validate(SunriseBanParameters model, ModelStateDictionary modelState)
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
        public void ValidateIds(SunriseBanParameters model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if ((model.Xuids == null || !model.Xuids.Any()) && (model.Gamertags == null || !model.Gamertags.Any()))
            {
                var xuidStatus = model.Xuids == null ? "Null" : "Empty";
                var gamertagStatus = model.Gamertags == null ? "Null" : "Empty";

                modelState.AddModelError(
                    "BanParameters.Xuids/BanParameters.Gamertags",
                    $"Properties must have at least one xuid or gamertag. {nameof(model.Xuids)} was {xuidStatus}. {nameof(model.Gamertags)} was {gamertagStatus}.");
            }
        }
    }
}
