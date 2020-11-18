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
        /// <param name="model">The model.</param>
        /// <param name="modelState">The model state.</param>
        void Validate(TModel model, ModelStateDictionary modelState);

        /// <summary>
        ///     Validate request IDs.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <param name="modelState">The model state.</param>
        void ValidateIds(TModel model, ModelStateDictionary modelState);

        /// <summary>
        ///     Generate error response.
        /// </summary>
        /// <param name="modelState">The model state.</param>
        /// <returns>An error response.</returns>
        string GenerateErrorResponse(ModelStateDictionary modelState);
    }
}
