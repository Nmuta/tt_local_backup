using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents UGC type options.
    /// </summary>
    /// <remarks>Copies enum values from Forza.LiveOps.FH4.Generated.ForzaUGCContentType.</remarks>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum UGCType
    {
        /// <summary>
        ///     Unknown UGC item type.
        /// </summary>
        Unknown = 0,

        /// <summary>
        ///     Livery UGC item type.
        /// </summary>
        Livery = 1,

        /// <summary>
        ///     Tune UGC item type.
        /// </summary>
        Tune = 3,

        /// <summary>
        ///     Photo UGC item type.
        /// </summary>
        Photo = 5,
    }
}