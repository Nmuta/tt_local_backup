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
        void LogCustomEvent(string eventName, IDictionary<string, string> eventProperties);

        /// <summary>
        ///     Logs an exception to application insights.
        /// </summary>
        void LogException(Exception ex);
    }
}
