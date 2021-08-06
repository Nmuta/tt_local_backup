using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents UGC sort options.
    /// </summary>
    /// <remarks>
    ///     Matches values with Services enum ForzaOrderBy.
    /// </remarks>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum UGCOrderBy
    {
        /// <summary>
        ///     Sorts by popularity score descending.
        /// </summary>
        PopularityScoreDesc,

        /// <summary>
        ///     Sorts by popularity score ascending.
        /// </summary>
        PopularityScoreAsc,

        /// <summary>
        ///     Sorts by created date descending.
        /// </summary>
        CreatedDateDesc,

        /// <summary>
        ///     Sorts by created date ascending.
        /// </summary>
        CreatedDateAsc,
    }
}
