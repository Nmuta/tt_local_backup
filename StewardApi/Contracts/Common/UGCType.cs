using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents UGC type options.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum UGCType
    {
        /// <summary>
        ///     Unknown UGC item type.
        /// </summary>
        Unknown,

        /// <summary>
        ///     Livery UGC item type.
        /// </summary>
        Livery,

        /// <summary>
        ///     Photo UGC item type.
        /// </summary>
        Photo,
    }
}