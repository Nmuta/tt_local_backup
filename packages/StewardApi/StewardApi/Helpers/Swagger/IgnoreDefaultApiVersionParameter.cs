using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;

namespace Turn10.LiveOps.StewardApi.Helpers.Swagger
{
    /// <summary>
    ///     Avoids displaying an irrelevant "api-version" parameter for APIs which have none.
    /// </summary>
    public class IgnoreDefaultApiVersionParameter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var versionParameter = operation.Parameters
                .FirstOrDefault(p => p.Name == "api-version" && p.In == ParameterLocation.Query);

            if (versionParameter != null)
                operation.Parameters.Remove(versionParameter);
        }
    }
}
