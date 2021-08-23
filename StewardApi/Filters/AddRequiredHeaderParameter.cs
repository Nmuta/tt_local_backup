using System.Collections.Generic;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Turn10.LiveOps.StewardApi.Filters
{
    /// <summary>
    ///     Adds required header parameters to Swagger.
    /// </summary>
    public class AddRequiredHeaderParameter : IOperationFilter
    {
        /// <summary>
        ///     Adds endpointKey header input to Open API parameters.
        /// </summary>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            operation.Parameters ??= new List<OpenApiParameter>();

            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "endpointKey",
                In = ParameterLocation.Header,
                Required = false
            });
        }
    }
}