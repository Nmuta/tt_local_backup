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
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="NotificationsService.LiveOpsRetrieveForUserOutput"/>.
        /// </returns>
        public Task<LiveOpsRetrieveForUserOutput> LiveOpsRetrieveForUserAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Clear a notification.
        /// </summary>
        /// <param name="notificationId">The notification ID.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        public Task ClearAsync(Guid notificationId);

        /// <summary>
        ///     Get categories.
        /// </summary>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetCategoriesOutput"/>.
        /// </returns>
        public Task<GetCategoriesOutput> GetCategoriesAsync(int maxResults);

        /// <summary>
        ///     Get categories for web.
        /// </summary>
        /// <param name="cultureCode">The culture code.</param>
        /// <returns>
        ///     The <see cref="GetCategoriesForWebOutput"/>.
        /// </returns>
        public Task<GetCategoriesForWebOutput> GetCategoriesForWebAsync(string cultureCode);

        /// <summary>
        ///     Mark as read.
        /// </summary>
        /// <param name="notificationId">The notification ID.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        public Task MarkReadAsync(Guid notificationId);

        /// <summary>
        ///     Retrieve for user.
        /// </summary>
        /// <param name="nonce">The nonce.</param>
        /// <param name="maxResults">The max results.</param>
        /// <param name="parameterBlockSize">The parameter block size.</param>
        /// <returns>
        ///     The <see cref="RetrieveForUserOutput"/>.
        /// </returns>
        public Task<RetrieveForUserOutput> RetrieveForUserAsync(short nonce, int maxResults, int parameterBlockSize);

        /// <summary>
        ///     Start new session.
        /// </summary>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        public Task StartNewSessionAsync();

        /// <summary>
        ///     Send message notification.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="message">The message.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        public Task SendMessageNotificationAsync(ulong xuid, string message);

        /// <summary>
        ///     Send group message.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <param name="message">The message.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        public Task SendGroupMessageNotificationAsync(int groupId, string message);
    }
}
