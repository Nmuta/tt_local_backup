using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Base class for validating requests.
    /// </summary>
    public abstract class RequestValidatorBase
    {
        /// <summary>
        ///     Generate error response.
        /// </summary>
        public string GenerateErrorResponse(ModelStateDictionary modelState)
        {
            var modelStateErrors = new List<string>();

            foreach (var modelStateKey in modelState.Keys)
            {
                var modelStateValue = modelState[modelStateKey];
                foreach (var error in modelStateValue.Errors)
                {
                    var key = modelStateKey;
                    var errorMessage = error.ErrorMessage;
                    var message = $"{key}: {errorMessage}";
                    modelStateErrors.Add(message);
                }
            }

            return string.Join(",", modelStateErrors);
        }

        /// <summary>
        ///     Validates title value.
        /// </summary>
        public string ValidateTitleValue(ModelStateDictionary modelState)
        {
            var title = modelState["title"]?.AttemptedValue;
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));

            var acceptedTitles = ApplicationSettings.SupportedTitles.Select(x => x.Codename);

            if (!acceptedTitles.Contains(title, StringComparer.CurrentCultureIgnoreCase))
            {
                throw new NotSupportedException($"{title} is not a valid title.");
            }

            return title;
        }
    }
}
