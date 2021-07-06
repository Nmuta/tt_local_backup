using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the possible auction sort options.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum AuctionSort
    {
        /// <summary>
        ///     Sorts by closing date ascending.
        /// </summary>
        ClosingDateAscending,

        /// <summary>
        ///     Sorts by closing date descending.
        /// </summary>
        ClosingDateDescending,
    }
}
