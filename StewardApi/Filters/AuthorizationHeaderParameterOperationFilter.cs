using System.Collections.Generic;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Turn10.LiveOps.StewardApi.Filters
{
    /// <summary>
    ///     Represents an authorization header parameter operation filter.
    /// </summary>
    public class AuthorizationHeaderParameterOperationFilter : IOperationFilter
    {
        /// <summary>
        ///     Apply the operation.
        /// </summary>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.Security == null)
            {
                operation.Security = new List<OpenApiSecurityRequirement>();
            }

            var scheme = new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "bearer" } };
            operation.Security.Add(new OpenApiSecurityRequirement
            {
                [scheme] = new List<string>()
            });
        }
    }
}
