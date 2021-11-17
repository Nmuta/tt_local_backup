﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <summary>
    ///     Exposes methods for interacting with Steelhead notification history.
    /// </summary>
    public interface ISteelheadNotificationHistoryProvider
    {
        /// <summary>
        ///     Updates notification history.
        /// </summary>
        Task UpdateNotificationHistoryAsync(
            NotificationHistory notificationHistory);

        /// <summary>
        ///     Gets notification histories.
        /// </summary>
        Task<IList<NotificationHistory>> GetNotificationHistoriesAsync(
            string notificationId,
            string title,
            string endpoint);
    }
}
