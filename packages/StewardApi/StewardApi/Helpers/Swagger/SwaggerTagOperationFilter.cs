using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Linq;

// based on https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/467
namespace Turn10.LiveOps.StewardApi.Helpers.Swagger
{
    /// <summary>
    ///     Applies Swagger UI tags to the given operation and child operations. May be applied at class or method level.
    ///     Tags on the Swagger UI page to appear in a certain order: <br/>
    ///     1. Priority tags in a custom order (see PriorityThenAlphanumericComparer.PriorityOrder). <br/>
    ///     2. Alphabetic. <br/>
    /// </summary>
    /// <remarks>
    ///     Use InDev to bring in-development APIs to the top of the page.
    ///     Use Agnostic to note endpoints that do not depend on title.
    ///     Use Multiple to note endpoints that depend on multiple titles.
    ///     Use CodeName to note endpoints that depend on a title.
    /// </remarks>
    public class SwaggerTagOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (context.ApiDescription.ActionDescriptor is ControllerActionDescriptor controllerActionDescriptor)
            {
                var tagsAttributes = controllerActionDescriptor
                    .EndpointMetadata
                    .Where(metadata => metadata is TagsAttribute)
                    .Cast<TagsAttribute>();

                var validTags = tagsAttributes
                    .SelectMany(attribute =>
                        attribute.Tags
                            .Where(t => !string.IsNullOrWhiteSpace(t))
                            .Select(t => new OpenApiTag { Name = t })
                        ?? Enumerable.Empty<OpenApiTag>());
                if (validTags.Any())
                {
                    operation.Tags = validTags.ToList();
                }
            }
        }
    }
}
