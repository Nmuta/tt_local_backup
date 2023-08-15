﻿using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Logging
{
    /// <summary>
    ///     Extensions for easier interaction with <see cref="ILoggingService"/>.
    /// </summary>
    public static class LoggingServiceExtensions
    {
        /// <summary>
        ///     Logs an event with details relating to an inventory item.
        /// </summary>
        public static void LogInventoryEvent(this ILoggingService logger, string message, string gameTitle, PlayerInventoryItem item, string metadata)
        {
            logger.LogCustomEvent($"{gameTitle}: {message}", new Dictionary<string, string>
            {
                ["ItemId"] = $"{item?.Id}",
                ["Metadata"] = metadata,
            });
        }
    }
}
