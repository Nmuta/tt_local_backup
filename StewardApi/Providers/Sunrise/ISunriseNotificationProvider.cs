using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with Sunrise notifications.
    /// </summary>
    public interface ISunriseNotificationProvider
    {
        /// <summary>
        ///     Gets player notifications.
        /// </summary>
        Task<IList<Notification>> GetPlayerNotificationsAsync(ulong xuid, int maxResults, string endpoint);

        /// <summary>
        ///     Gets user group notifications.
        /// </summary>
        Task<IList<UserGroupNotification>> GetGroupNotificationsAsync(
            int groupId,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets user group notification.
        /// </summary>
        Task<UserGroupNotification> GetGroupNotificationAsync(
            Guid notificationId,
            string endpoint);

        /// <summary>
        ///     Sends notifications.
        /// </summary>
        Task<IList<MessageSendResult<ulong>>> SendNotificationsAsync(
            IList<ulong> xuids,
            string message,
            DateTime expireTimeUtc,
            string endpoint);

        /// <summary>
        ///     Sends group notification.
        /// </summary>
        Task<MessageSendResult<int>> SendGroupNotificationAsync(
            int groupId,
            string message,
            DateTime expireTimeUtc,
            DeviceType deviceType,
            string requesterObjectId,
            string endpoint);

        /// <summary>
        ///     Edit notification.
        /// </summary>
        Task EditNotificationAsync(
            Guid notificationId,
            ulong xuid,
            string message,
            DateTime expireTimeUtc,
            string endpoint);

        /// <summary>
        ///     Edit group notification.
        /// </summary>
        Task EditGroupNotificationAsync(
            Guid notificationId,
            string message,
            DateTime expireTimeUtc,
            DeviceType deviceType,
            string requesterObjectId,
            string endpoint);

        /// <summary>
        ///     Deletes notification.
        /// </summary>
        Task DeleteNotificationAsync(Guid notificationId, ulong xuid, string endpoint);

        /// <summary>
        ///     Deletes group notification.
        /// </summary>
        Task DeleteGroupNotificationAsync(Guid notificationId, string requesterObjectId, string endpoint);
    }
}
