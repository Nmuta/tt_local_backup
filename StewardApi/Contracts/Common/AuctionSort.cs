using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents auction sort options.
    /// </summary>
    /// <remarks>
    ///     Matches values with Services enum ForzaSearchOrderBy.
    /// </remarks>
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
