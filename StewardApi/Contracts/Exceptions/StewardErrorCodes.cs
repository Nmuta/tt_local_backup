using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents commonly usd error codes for Steward.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum StewardErrorCode
    {
        /// <summary>
        ///     The profile not found error code.
        /// </summary>
        DocumentNotFound,

        /// <summary>
        ///     The invalid argument error code.
        /// </summary>
        RequiredParameterMissing,

        /// <summary>
        ///     The unknown failure error code.
        /// </summary>
        UnknownFailure,

        /// <summary>
        ///     The failed to send error code.
        /// </summary>
        FailedToSend
    }
}
