using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

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
        void LogException(AppInsightsException ex);
    }
}
