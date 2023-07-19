using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents telemetry log levels.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum TelemetryLogLevel
    {
        /// <summary>
        ///     Fine grain informational logs.
        /// </summary>
        Trace,

        /// <summary>
        ///     Used to track non-fatal errors that might allow the application to continue running.
        /// </summary>
        Error,

        /// <summary>
        ///     A very severe error that will likely lead to application abort and/or 500 error.
        /// </summary>
        Fatal
    }
}
