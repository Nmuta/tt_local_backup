using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Validation.Steelhead
{
    /// <summary>
    ///     Validates a <see cref="SteelheadBanParametersInput"/> request.
    /// </summary>
    public sealed class SteelheadBanParametersRequestValidator : RequestValidatorBase, IRequestValidator<SteelheadBanParametersInput>
    {
        /// <inheritdoc />
        public void Validate(SteelheadBanParametersInput model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (!model.DeleteLeaderboardEntries.HasValue)
            {
                modelState.AddModelError("BanParameters.DeleteLeaderboardEntries", $"{nameof(model.DeleteLeaderboardEntries)} must not be null.");
            }
        }

        /// <inheritdoc />
        public void ValidateIds(SteelheadBanParametersInput model, ModelStateDictionary modelState)
        {
            model.ShouldNotBeNull(nameof(model));
            modelState.ShouldNotBeNull(nameof(modelState));

            if (!model.Xuid.HasValue)
            {
                modelState.AddModelError(
                    "BanParameters.Xuid/BanParameters.Gamertag",
                    $"Properties must have either XUID or Gamertag defined. {nameof(model.Xuid)} was {model.Xuid}.");
            }

            if (!model.Xuid.Value.IsValidXuid())
            {
                modelState.AddModelError("BanParameters.Xuid", $"Provided XUID does not meet requirements: {model.Xuid}");
            }
        }
    }
}
