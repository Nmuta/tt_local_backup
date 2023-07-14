using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the possible auction statuses.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ForzaReportingState
    {
        /// <summary>
        ///     Default reporting state.
        /// </summary>
        Default,

        /// <summary>
        ///     Flagged for review reporting state.
        /// </summary>
        FlaggedForReview,

        /// <summary>
        ///     Admin removed reporting state.
        /// </summary>
        AdminRemoved,

        /// <summary>
        ///     Admin approved reporting state.
        /// </summary>
        AdminApproved,
    }
}
