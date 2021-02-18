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
    public sealed class ApolloBanParametersRequestValidator : RequestValidatorBase, IRequestValidator<ApolloBanParametersInput>
    {
        /// <inheritdoc />
        public void Validate(ApolloBanParametersInput model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (!model.Duration.HasValue)
            {
                modelState.AddModelError("BanParameters.Duration", $"Property value must be valid TimeSpan. {nameof(model.Duration)} was {model.Duration}.");
            }

            if (model.Duration == TimeSpan.Zero)
            {
                modelState.AddModelError("BanParameters.Duration", $"Duration must be non-zero. {nameof(model.Duration)} was {model.Duration}.");
            }

            if (model.Duration < TimeSpan.Zero)
            {
                modelState.AddModelError("BanParameters.Duration", $"Duration must be positive. {nameof(model.Duration)} was {model.Duration}.");
            }

            if (!model.BanAllConsoles.HasValue)
            {
                modelState.AddModelError("BanParameters.BanAllConsoles", $"{nameof(model.BanAllConsoles)} must not be null.");
            }

            if (!model.BanAllPcs.HasValue)
            {
                modelState.AddModelError("BanParameters.BanAllPcs", $"{nameof(model.BanAllPcs)} must not be null.");
            }

            if (!model.DeleteLeaderboardEntries.HasValue)
            {
                modelState.AddModelError("BanParameters.DeleteLeaderboardEntries", $"{nameof(model.DeleteLeaderboardEntries)} must not be null.");
            }

            if (!model.SendReasonNotification.HasValue)
            {
                modelState.AddModelError("BanParameters.SendReasonNotification", $"{nameof(model.SendReasonNotification)} must not be null.");
            }

            if (model.SendReasonNotification.Value && string.IsNullOrWhiteSpace(model.Reason))
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
        public void ValidateIds(ApolloBanParametersInput model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (!model.Xuid.HasValue && string.IsNullOrWhiteSpace(model.Gamertag))
            {
                modelState.AddModelError(
                    "BanParameters.Xuid/BanParameters.Gamertag",
                    $"Properties must have either XUID or Gamertag defined. {nameof(model.Xuid)} was {model.Xuid}. {nameof(model.Gamertag)} was {model.Gamertag}.");
            }
        }
    }
}
