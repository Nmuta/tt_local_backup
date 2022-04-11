using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Turn10.LiveOps.StewardApi.Helpers.Swagger
{
    /// <summary>
    ///     Forces tags on the Swagger UI page to appear in a certain order: <br/>
    ///     1. Priority tags in a custom order (see <see cref="PriorityThenAlphanumericComparer.PriorityOrder"/>). <br/>
    ///     2. Alphabetic. <br/>
    /// </summary>
    /// <remarks>
    ///     Use InDev to bring in-development APIs to the top of the page.
    /// </remarks>
    public class ReorderTagsDocumentFilter : IDocumentFilter
    {
        public void Apply(OpenApiDocument document, DocumentFilterContext context)
        {
            var aggregateTags = document.Paths.SelectMany(path => path.Value.Operations.SelectMany(operation => operation.Value.Tags)).Distinct();
            var orderedTags = aggregateTags
                .OrderBy(tag => tag.Name, new PriorityThenAlphanumericComparer())
                .ToList();
            document.Tags = orderedTags;
        }

        private class PriorityThenAlphanumericComparer : IComparer<string>
        {
            /// <summary>
            ///     The priority order of tags to display at the top of the Swagger UI page.
            /// </summary>
            private enum PriorityOrder
            {
                /// <summary>Use to bring in-development APIs to the top of the docs list.</summary>
                InDev,

                /// <summary>Use for services that call multiple upstream LSPs.</summary>
                Multiple,

                /// <summary>Use for services that do not call LSP, or do not care which LSP/title they call.</summary>
                Agnostic,

                Steelhead,
                Woodstock,
                Sunrise,
                Gravity,
                Apollo,
            }

            public int Compare(string x, string y)
            {
                var foundX = Enum.TryParse(typeof(PriorityOrder), x, out var xEnum);
                var foundY = Enum.TryParse(typeof(PriorityOrder), y, out var yEnum);
                if (foundX && !foundY)
                {
                    return -1;
                }

                if (foundY && !foundX)
                {
                    return 1;
                }

                if (foundX && foundY)
                {
                    return (int)xEnum - (int)yEnum;
                }

                return string.Compare(x, y, StringComparison.OrdinalIgnoreCase);
            }
        }
    }
}
