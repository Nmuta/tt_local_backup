using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents title with tables in the Game DB.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum KustoGameDbSupportedTitle
    {
        /// <summary>
        ///     Forza Motorsport 7's internal name.
        /// </summary>
        Apollo,

        /// <summary>
        ///     Forza Horizon 3's internal name.
        /// </summary>
        Opus,

        /// <summary>
        ///     Forza Horizon 4's internal name.
        /// </summary>
        Sunrise,

        /// <summary>
        ///     Forza Motorsport 8's internal name.
        /// </summary>
        Steelhead
    }
}
