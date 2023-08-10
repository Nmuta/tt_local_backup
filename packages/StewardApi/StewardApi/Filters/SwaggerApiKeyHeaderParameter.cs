using System.Collections.Generic;
using System.Text.RegularExpressions;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Filters
{
    /// <summary>
    ///     Adds optional API key header parameters to Swagger.
    /// </summary>
    public class SwaggerApiKeyHeaderParameter : IOperationFilter
    {
        /// <summary>
        ///     Adds API key header input to Open API parameters for external API endponts.
        /// </summary>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            operation.Parameters ??= new List<OpenApiParameter>();

            var path = context.ApiDescription.RelativePath;
            var isExternalPath = new Regex(@"(?i)^api\/external\/*").IsMatch(path);

            if (isExternalPath)
            {
                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = StandardHeaders.XApiKey,
                    In = ParameterLocation.Header,
                    Required = false,
                    Schema = new OpenApiSchema(),
                });
            }
        }
    }
}
