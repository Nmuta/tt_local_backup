using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Helpers.Swagger
{
    /// <summary>
    ///     Forces tags on the Swagger UI page to appear in a certain order: <br/>
    ///     1. Priority tags in a custom order (see <see cref="ReorderTagsDocumentFilter.Order"/>). <br/>
    ///     2. Alphabetic. <br/>
    /// </summary>
    /// <remarks>
    ///     Use InDev to bring in-development APIs to the top of the page.
    /// </remarks>
    public class ReorderTagsDocumentFilter : IDocumentFilter
    {
        private static IEnumerable<string> Order { get; } = new List<string>
        {
            Meta.All,
            Meta.DangerousAll,
            Dev.InDev,

            Title.Multiple,
            Title.Agnostic,

            Title.Steelhead,
            Title.Woodstock,
            Title.Sunrise,
            Title.Apollo,

            Sentinel.NonDangerousAlphabetic,

            Dev.SteelheadTest,
            Dev.WoodstockTest,
            Dev.SunriseTest,
            Dev.ApolloTest,

            Sentinel.Dangerous,

            Dev.ReviseTags,
            Dev.Incomplete,
        };

        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            swaggerDoc.Tags = this.OrderTags(swaggerDoc).ToList();
        }

        private IEnumerable<OpenApiTag> OrderTags(OpenApiDocument document)
        {
            var aggregateTags = document.Paths.SelectMany(path => path.Value.Operations.SelectMany(operation => operation.Value.Tags)).Distinct();
            var aggregateTagsByName = aggregateTags.GroupBy(t => t.Name).ToDictionary(t => t.Key, t => t.ToList());

            var knownNonSentinelTags = Order.Where(v => !Sentinel.Values.Contains(v)).ToHashSet();
            var aggregateTagsWithoutSlots = aggregateTagsByName.Keys.Where(v => !knownNonSentinelTags.Contains(v)).ToHashSet();

            foreach (var item in Order)
            {
                if (Sentinel.Values.Contains(item))
                {
                    // if we see a sentinel, we should order the unknown tags by the chosen method
                    var orderedTagsWithoutSlots = this.OrderUnknownTags(item, aggregateTagsByName, aggregateTagsWithoutSlots);
                    foreach (var tag in orderedTagsWithoutSlots)
                    {
                        yield return tag;
                    }
                }
                else if (aggregateTagsByName.TryGetValue(item, out var tags))
                {
                    // if this isn't a sentinel and we have values, spit them out
                    foreach (var tag in tags)
                    {
                        yield return tag;
                    }
                }
                else
                {
                    // we don't have values for this known tag, which means it is unused.
                }
            }
        }

        private IEnumerable<OpenApiTag> OrderUnknownTags(
            string sentinel,
            Dictionary<string, List<OpenApiTag>> aggregateTagsByName,
            HashSet<string> aggregateTagsWithoutSlots)
        {
            switch (sentinel)
            {
                case Sentinel.Dangerous:
                    return aggregateTagsWithoutSlots.Where(IsDangerous).OrderBy(t => t).SelectMany(t => aggregateTagsByName[t]).ToList();
                case Sentinel.NonDangerousAlphabetic:
                    return aggregateTagsWithoutSlots.Where(t => !IsDangerous(t)).OrderBy(t => t).SelectMany(t => aggregateTagsByName[t]).ToList();
                case Sentinel.UnknownAlphabetic:
                    return aggregateTagsWithoutSlots.OrderBy(t => t).SelectMany(t => aggregateTagsByName[t]).ToList();
                default:
                    throw new InvalidOperationException($"Unknown sentinel '{sentinel}'");
            }
        }
    }
}
