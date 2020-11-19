using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a telemetry event.
    /// </summary>
    public class TelemetryEvent
    {
        /// <summary>
        ///     Gets or sets the telemetry body.
        /// </summary>
        public virtual string Body { get; set; }

        /// <summary>
        ///     Gets or sets the timestamp in UTC.
        /// </summary>
        public DateTime TimestampUtc { get; set; }

        /// <summary>
        ///     Gets or sets the <see cref="TelemetryLogLevel"/>.
        /// </summary>
        public TelemetryLogLevel LogLevel { get; set; }
    }
}
