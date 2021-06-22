using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a notification.
    /// </summary>
    public sealed class Notification
    {
        /// <summary>
        ///     Gets or sets the notification type.
        /// </summary>
        public string NotificationType { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the message is read.
        /// </summary>
        public bool IsRead { get; set; }

        /// <summary>
        ///     Gets or sets the Notification ID.
        /// </summary>
        public Guid NotificationId { get; set; }

        /// <summary>
        ///     Gets or sets the send date.
        /// </summary>
        public DateTime SendDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the expiration date.
        /// </summary>
        public DateTime ExpirationDateUtc { get; set; }
    }
}