namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents Signal R Event strings for use in Notification Hub.
    /// </summary>
    public static class NotificationHubEvents
    {
        /// <summary>
        ///     SignalR event for notification hub to mark a job as read.
        /// </summary>
        public const string MarkJobRead = "NotificationHubMarkJobRead";

        /// <summary>
        ///     SignalR event for notification hub to mark a job as unread.
        /// </summary>
        public const string MarkJobUnread = "NotificationHubJobUnread";

        /// <summary>
        ///     SignalR event for notification hub to sync all jobs.
        /// </summary>
        public const string SyncAllJobs = "NotificationHubSyncAll";

        /// <summary>
        ///     SignalR event for notification hub to update a job's state.
        /// </summary>
        public const string UpdateJobState = "NotificationHubUpdateJobState";
    }
}
