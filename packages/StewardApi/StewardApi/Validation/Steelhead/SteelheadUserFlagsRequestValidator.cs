using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardApi.Validation.Steelhead
{
    /// <summary>
    ///     Validates a <see cref="SteelheadUserFlagsInput"/> request.
    /// </summary>
    public sealed class SteelheadUserFlagsRequestValidator : RequestValidatorBase, IRequestValidator<SteelheadUserFlagsInput>
    {
        /// <inheritdoc />
        public void Validate(SteelheadUserFlagsInput model, ModelStateDictionary modelState)
        {
            if (!model.IsEarlyAccess.HasValue)
            {
                modelState.AddModelError("UserFlags.IsEarlyAccess", $"{nameof(model.IsEarlyAccess)} must not be null.");
            }

            if (!model.IsTurn10Employee.HasValue)
            {
                modelState.AddModelError("UserFlags.IsTurn10Employee", $"{nameof(model.IsTurn10Employee)} must not be null.");
            }

            if (!model.IsUnderReview.HasValue)
            {
                modelState.AddModelError("UserFlags.IsUnderReview", $"{nameof(model.IsUnderReview)} must not be null.");
            }

            if (!model.IsSteamVip.HasValue)
            {
                modelState.AddModelError("UserFlags.IsSteamVip", $"{nameof(model.IsSteamVip)} must not be null.");
            }

            if (!model.IsSteamUltimateVip.HasValue)
            {
                modelState.AddModelError("UserFlags.IsSteamUltimateVip", $"{nameof(model.IsSteamUltimateVip)} must not be null.");
            }

            if (!model.IsGamecoreVip.HasValue)
            {
                modelState.AddModelError("UserFlags.IsGamecoreVip", $"{nameof(model.IsGamecoreVip)} must not be null.");
            }

            if (!model.IsGamecoreUltimateVip.HasValue)
            {
                modelState.AddModelError("UserFlags.IsGamecoreUltimateVip", $"{nameof(model.IsGamecoreUltimateVip)} must not be null.");
            }

            if (!model.IsCommunityManager.HasValue)
            {
                modelState.AddModelError("UserFlags.IsCommunityManager", $"{nameof(model.IsCommunityManager)} must not be null.");
            }

            if (!model.IsRaceMarshall.HasValue)
            {
                modelState.AddModelError("UserFlags.IsRaceMarshall", $"{nameof(model.IsRaceMarshall)} must not be null.");
            }
        }

        /// <inheritdoc />
        public void ValidateIds(SteelheadUserFlagsInput model, ModelStateDictionary modelState)
        {
            throw new NotImplementedException("ID validation not supported for SteelheadUserFlags");
        }
    }
}
