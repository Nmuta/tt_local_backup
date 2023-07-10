using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a user group notification.
    /// </summary>
    public sealed class UserGroupNotification
    {
        /// <summary>
        ///     Gets or sets the notification ID.
        /// </summary>
        public Guid NotificationId { get; set; }

        /// <summary>
        ///     Gets or sets the LSP group ID.
        /// </summary>
        public int GroupId { get; set; }

        /// <summary>
        ///     Gets or sets the sent date.
        /// </summary>
        public DateTime SentDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the expiration date.
        /// </summary>
        public DateTime ExpirationDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the message.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        ///     Gets or sets the title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        ///     Gets or sets the notification type.
        /// </summary>
        public string NotificationType { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the message has device type.
        /// </summary>
        public bool HasDeviceType { get; set; }

        /// <summary>
        ///     Gets or sets device type.
        /// </summary>
        public DeviceType DeviceType { get; set; }
    }
}
