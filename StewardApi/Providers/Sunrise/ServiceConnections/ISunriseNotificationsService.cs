using System;
using System.Threading.Tasks;
using Xls.WebServices.FH4.master.Generated;
using static Xls.WebServices.FH4.master.Generated.NotificationsService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with the Sunrise Notifications Service.
    /// </summary>
    public interface ISunriseNotificationsService
    {
        /// <summary>
        ///     Retrieves notifications for a user.
        /// </summary>
        public Task<LiveOpsRetrieveForUserOutput> LiveOpsRetrieveForUserAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Clear a notification.
        /// </summary>
        public Task ClearAsync(Guid notificationId);

        /// <summary>
        ///     Get categories.
        /// </summary>
        public Task<GetCategoriesOutput> GetCategoriesAsync(int maxResults);

        /// <summary>
        ///     Get categories for web.
        /// </summary>
        public Task<GetCategoriesForWebOutput> GetCategoriesForWebAsync(string cultureCode);

        /// <summary>
        ///     Mark as read.
        /// </summary>
        public Task MarkReadAsync(Guid notificationId);

        /// <summary>
        ///     Retrieve for user.
        /// </summary>
        public Task<RetrieveForUserOutput> RetrieveForUserAsync(short nonce, int maxResults, int parameterBlockSize);

        /// <summary>
        ///     Start new session.
        /// </summary>
        public Task StartNewSessionAsync();

        /// <summary>
        ///     Send message notification.
        /// </summary>
        public Task SendMessageNotificationAsync(ulong xuid, string message);

        /// <summary>
        ///     Send group message.
        /// </summary>
        public Task SendGroupMessageNotificationAsync(int groupId, string message);
    }
}
