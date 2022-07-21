using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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

            if (!model.IsVip.HasValue)
            {
                modelState.AddModelError("UserFlags.IsVip", $"{nameof(model.IsVip)} must not be null.");
            }

            if (!model.IsUltimateVip.HasValue)
            {
                modelState.AddModelError("UserFlags.IsUltimateVip", $"{nameof(model.IsUltimateVip)} must not be null.");
            }
        }

        /// <inheritdoc />
        public void ValidateIds(SteelheadUserFlagsInput model, ModelStateDictionary modelState)
        {
            throw new NotImplementedException("ID validation not supported for SteelheadUserFlags");
        }
    }
}
