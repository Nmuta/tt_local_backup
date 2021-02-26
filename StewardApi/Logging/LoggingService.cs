using System;
using System.Collections.Generic;
using Microsoft.ApplicationInsights;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Logging
{
    /// <inheritdoc />
    public sealed class LoggingService : ILoggingService
    {
        private readonly TelemetryClient telemetryClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LoggingService"/> class.
        /// </summary>
        /// <param name="telemetryClient">The Application Insights telemetry client.</param>
        public LoggingService(TelemetryClient telemetryClient)
        {
            telemetryClient.ShouldNotBeNull(nameof(telemetryClient));

            this.telemetryClient = telemetryClient;
        }

        /// <inheritdoc />
        public void LogException(Exception ex)
        {
            this.telemetryClient.TrackException(ex);
        }

        /// <inheritdoc />
        public void LogCustomEvent(string eventName, IDictionary<string, string> eventProperties)
        {
            this.telemetryClient.TrackEvent(eventName, eventProperties);
        }
    }
}
