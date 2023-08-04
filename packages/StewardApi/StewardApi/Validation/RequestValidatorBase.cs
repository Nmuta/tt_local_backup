using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections.Generic;

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
    }
}
