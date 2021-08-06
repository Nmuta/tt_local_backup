using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents UGC access levels.
    /// </summary>
    /// <remarks>
    ///     Matches values with Services enum ForzaShareFilter.
    /// </remarks>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum UGCAccessLevel
    {
        /// <summary>
        ///     Search public UGC items.
        /// </summary>
        Public,

        /// <summary>
        ///     Search private UGC items.
        /// </summary>
        Private,

        /// <summary>
        ///     Search public and private UGC items.
        /// </summary>
        Any,
    }
}