using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the supported notification actions.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum TitleCodeName
    {
        /// <summary>
        ///     No title.
        /// </summary>
        None,

        /// <summary>
        ///     Forza Horizon 3 codename.
        /// </summary>
        Opus,

        /// <summary>
        ///     Forza Motorsport 7 codename.
        /// </summary>
        Apollo,

        /// <summary>
        ///     Forza Horizon 4 codename.
        /// </summary>
        Sunrise,

        /// <summary>
        ///     Forza Horizon 5 codename.
        /// </summary>
        Woodstock,

        /// <summary>
        ///     Forza Motorsport 8 codename.
        /// </summary>
        Steelhead,

        /// <summary>
        ///     Secret codename.
        /// </summary>
        Forte,

        /// <summary>
        ///     Secret codename.
        /// </summary>
        Holland
    }
}
