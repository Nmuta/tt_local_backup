using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Xls.Security.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Validation.Woodstock
{
    /// <summary>
    ///     Validates a <see cref="WoodstockBanParametersInput"/> request.
    /// </summary>
    public sealed class WoodstockBanParametersRequestValidator : RequestValidatorBase, IRequestValidator<WoodstockBanParametersInput>
    {
        /// <inheritdoc />
        public void Validate(WoodstockBanParametersInput model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (!model.DeleteLeaderboardEntries.HasValue)
            {
                modelState.AddModelError("BanParameters.DeleteLeaderboardEntries", $"{nameof(model.DeleteLeaderboardEntries)} must not be null.");
            }
        }

        /// <inheritdoc />
        public void ValidateIds(WoodstockBanParametersInput model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (!model.Xuid.HasValue && string.IsNullOrWhiteSpace(model.Gamertag))
            {
                modelState.AddModelError(
                    "BanParameters.Xuid/BanParameters.Gamertag",
                    $"Properties must have either XUID or Gamertag defined. {nameof(model.Xuid)} was {model.Xuid}. {nameof(model.Gamertag)} was {model.Gamertag}.");
            }

            if (model.Xuid.HasValue && !model.Xuid.Value.IsValidXuid())
            {
                modelState.AddModelError("BanParameters.Xuid", $"Provided XUID does not meet requirements: {model.Xuid}");
            }
        }
    }
}
