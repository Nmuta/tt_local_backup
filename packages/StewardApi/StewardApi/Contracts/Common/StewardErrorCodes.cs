using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents commonly usd error codes for Steward.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum StewardErrorCode
    {
        /// <summary>
        ///     The bad request error code.
        /// </summary>
        BadRequest,

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
        FailedToSend,

        /// <summary>
        ///     The conversion failed error code.
        /// </summary>
        ConversionFailed,

        /// <summary>
        ///     The query failed error code.
        /// </summary>
        QueryFailed,

        /// <summary>
        ///     The duplicate entry error code.
        /// </summary>
        DuplicateEntry,

        /// <summary>
        ///     The services failure error code.
        /// </summary>
        ServicesFailure,

        /// <summary>
        ///     A test error code, only for use within the /util/ routes.
        /// </summary>
        RelayedFromUtil,

        /// <summary>
        ///     An error occured in a service proxy.
        /// </summary>
        ServiceProxyError,

        /// <summary>
        ///     Access is forbidden.
        /// </summary>
        Forbidden,
    }
}
