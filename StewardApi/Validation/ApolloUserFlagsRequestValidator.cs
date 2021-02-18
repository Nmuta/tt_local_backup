using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Validates a <see cref="ApolloUserFlagsInput"/> request.
    /// </summary>
    public class ApolloUserFlagsRequestValidator : RequestValidatorBase, IRequestValidator<ApolloUserFlagsInput>
    {
        /// <inheritdoc />
        public void Validate(ApolloUserFlagsInput model, ModelStateDictionary modelState)
        {
            if (!model.IsCommunityManager.HasValue)
            {
                modelState.AddModelError("UserFlags.IsCommunityManager", $"{nameof(model.IsCommunityManager)} must not be null.");
            }

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
        }

        /// <inheritdoc />
        public void ValidateIds(ApolloUserFlagsInput model, ModelStateDictionary modelState)
        {
            throw new NotImplementedException("ID validation not supported for ApolloUserFlags");
        }
    }
}
