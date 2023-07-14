using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Turn10.LiveOps.StewardApi.Filters
{
    /// <summary>
    ///     Represents a session ID header parameter operation filter.
    /// </summary>
    public class SessionIdHeaderParameterOperationFilter : IOperationFilter
    {
        /// <summary>
        ///     The session ID header name.
        /// </summary>
        public const string SessionIdHeaderName = "X-SessionId";

        /// <summary>
        ///     Apply the operation.
        /// </summary>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var parameter = new OpenApiParameter
            {
                Name = SessionIdHeaderName,
                In = ParameterLocation.Header,
                Description = "Session Id",
                Required = false,
                Schema = new OpenApiSchema { Type = "string", Format = "uuid" }
            };

            if (operation.Parameters != null)
            {
                operation.Parameters.Add(parameter);
            }
            else
            {
                operation.Parameters = new[] { parameter };
            }
        }
    }
}