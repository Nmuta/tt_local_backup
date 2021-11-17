using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with Sunrise notification history.
    /// </summary>
    public interface ISunriseNotificationHistoryProvider
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
