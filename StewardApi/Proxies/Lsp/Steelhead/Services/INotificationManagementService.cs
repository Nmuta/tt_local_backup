using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FM8.Generated;
using NotificationManagementService = Turn10.Services.LiveOps.FM8.Generated.NotificationsManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    public interface INotificationManagementService
    {
        /// <summary>
        ///     Gets all messages from a player.
        /// </summary>
        Task<NotificationManagementService.LiveOpsRetrieveForUserOutput> LiveOpsRetrieveForUser(
            ulong xuid,
            int maxResults);

        /// <summary>
        ///     Sends message to multiple players.
        /// </summary>
        Task<NotificationManagementService.SendMessageNotificationToMultipleUsersOutput> SendMessageNotificationToMultipleUsers(
            ulong[] recipients,
            int xuidCount,
            string message,
            DateTime expirationTime,
            string imageUrl = null);

        /// <summary>
        ///     Sends message to a LSP user group.
        /// </summary>
        Task<NotificationManagementService.SendGroupMessageNotificationOutput> SendGroupMessageNotification(
            int groupId,
            string message,
            DateTime expirationTime,
            bool hasDeviceType,
            ForzaLiveDeviceType deviceType);

        /// <summary>
        ///     Sends message to a specific device type.
        /// </summary>
        Task<NotificationManagementService.SendNotificationByDeviceTypeOutput> SendNotificationByDeviceType(
            ForzaLiveDeviceType deviceType,
            string message,
            DateTime expirationTime);

        /// <summary>
        ///     Edits a player message.
        /// </summary>
        Task EditNotification(
            Guid notificationId,
            ulong xuid,
            ForzaCommunityMessageNotificationEditParameters editParameters);

        /// <summary>
        ///     Edits message from an LSP user group.
        /// </summary>
        Task EditGroupNotification(
            Guid notificationId,
            ForzaCommunityMessageNotificationEditParameters editParameters);

        /// <summary>
        ///     Gets all messages from an LSP user group.
        /// </summary>
        Task<NotificationManagementService.GetAllUserGroupMessagesOutput> GetAllUserGroupMessages(
            int groupId,
            int maxResults);

        /// <summary>
        ///     Gets message an LSP user group.
        /// </summary>
        Task<NotificationManagementService.GetUserGroupMessageOutput> GetUserGroupMessage(
            Guid notificationId);

        /// <summary>
        ///     Gets message from a player.
        /// </summary>
        Task<NotificationManagementService.GetNotificationOutput> GetNotification(
            ulong xuid,
            Guid notificationId);

        /// <summary>
        ///     Deletes all messages from a player.
        /// </summary>
        /// <remarks>To be used for E2E testing only.</remarks>
        Task<NotificationManagementService.DeleteNotificationsForUserOutput> DeleteNotificationsForUser(
            ulong xuid);
    }
}
