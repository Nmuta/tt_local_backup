using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Validation.Woodstock
{
    /// <summary>
    ///     Validates a <see cref="WoodstockUserFlagsInput"/> request.
    /// </summary>
    public sealed class WoodstockUserFlagsRequestValidator : RequestValidatorBase, IRequestValidator<WoodstockUserFlagsInput>
    {
        /// <inheritdoc />
        public void Validate(WoodstockUserFlagsInput model, ModelStateDictionary modelState)
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

            if (!model.IsVip.HasValue)
            {
                modelState.AddModelError("UserFlags.IsVip", $"{nameof(model.IsVip)} must not be null.");
            }

            if (!model.IsUltimateVip.HasValue)
            {
                modelState.AddModelError("UserFlags.IsUltimateVip", $"{nameof(model.IsUltimateVip)} must not be null.");
            }

            if (!model.IsRaceMarshall.HasValue)
            {
                modelState.AddModelError("UserFlags.IsRaceMarshall", $"{nameof(model.IsRaceMarshall)} must not be null.");
            }

            if (!model.IsCommunityManager.HasValue)
            {
                modelState.AddModelError("UserFlags.IsCommunityManager", $"{nameof(model.IsCommunityManager)} must not be null.");
            }
        }

        /// <inheritdoc />
        public void ValidateIds(WoodstockUserFlagsInput model, ModelStateDictionary modelState)
        {
            throw new NotImplementedException("ID validation not supported for SunriseUserFlags");
        }
    }
}
