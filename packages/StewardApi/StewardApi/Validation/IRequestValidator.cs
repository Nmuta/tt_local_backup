using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Validates a request.
    /// </summary>
    /// <typeparam name="TModel">The type of the model.</typeparam>
    public interface IRequestValidator<TModel>
    {
        /// <summary>
        ///     Validate a request.
        /// </summary>
        void Validate(TModel model, ModelStateDictionary modelState);

        /// <summary>
        ///     Validate request IDs.
        /// </summary>
        void ValidateIds(TModel model, ModelStateDictionary modelState);

        /// <summary>
        ///     Generate error response.
        /// </summary>
        string GenerateErrorResponse(ModelStateDictionary modelState);
    }
}
