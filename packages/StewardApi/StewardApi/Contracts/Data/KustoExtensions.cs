using Kusto.Data.Common;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Syntactic sugar for Kusto actions.
    /// </summary>
    public static class KustoExtensions
    {
        /// <summary>
        ///     Converts the object to JSON column mappings.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        public static IList<JsonColumnMapping> ToJsonColumnMappings<T>(this T self)
        {
            var jObject = JObject.Parse(self.ToJson());

            var properties = jObject.Properties();

            return properties.Select(property => new JsonColumnMapping { ColumnName = property.Name, JsonPath = $"$.{property.Name}" }).ToList();
        }
    }
}
