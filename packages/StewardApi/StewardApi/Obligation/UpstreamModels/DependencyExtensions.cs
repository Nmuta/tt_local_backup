using System.Collections.Generic;
using System.Linq;

namespace Turn10.LiveOps.StewardApi.Obligation.UpstreamModels
{
    /// <summary>
    ///     Extensions to aid in handling of Dependencies.
    /// </summary>
    public static class DependencyExtensions
    {
        /// <summary>
        ///     Selects dependencies with the given type.
        /// </summary>
        public static IEnumerable<Dependency> OfType(this IEnumerable<Dependency> source, string type)
        {
            return source.Where(v => v.Type == type);
        }

        /// <summary>
        ///     Excludes dependencies with the given type.
        /// </summary>
        public static IEnumerable<Dependency> NotOfType(this IEnumerable<Dependency> source, string type)
        {
            return source.Where(v => v.Type != type);
        }

        /// <summary>
        ///     Selects names of passed dependencies.
        /// </summary>
        public static IEnumerable<string> ToDependencyNames(this IEnumerable<Dependency> source)
        {
            return source.Select(v => v.DataActivityDependencyName);
        }
    }
}
