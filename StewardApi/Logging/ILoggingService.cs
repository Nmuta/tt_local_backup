using System;
using System.Collections;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Logging
{
    /// <summary>
    ///     Exposes methods for logging to application insights.
    /// </summary>
    public interface ILoggingService
    {
        /// <summary>
        ///     Logs an exception to application insights.
        /// </summary>
        /// <param name="eventName">The event name.</param>
        /// <param name="eventProperties">The event properties.</param>
        void LogCustomEvent(string eventName, IDictionary<string, string> eventProperties);

        /// <summary>
        ///     Logs an exception to application insights.
        /// </summary>
        /// <param name="ex">The exception to log.</param>
        void LogException(Exception ex);
    }
}
