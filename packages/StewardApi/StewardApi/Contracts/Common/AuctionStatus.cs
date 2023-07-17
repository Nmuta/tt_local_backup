using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the possible auction statuses.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum AuctionStatus
    {
        /// <summary>
        ///     The auction is open.
        /// </summary>
        Open,

        /// <summary>
        ///     The auction was canceled.
        /// </summary>
        Cancelled,

        /// <summary>
        ///     The auction was successful.
        /// </summary>
        Successful,

        /// <summary>
        ///     The auction failed.
        /// </summary>
        Failed,

        /// <summary>
        ///     Any auction status.
        /// </summary>
        Any,
    }
}
