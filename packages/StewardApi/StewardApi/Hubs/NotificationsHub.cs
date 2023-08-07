using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Hubs
{
    /// <summary>
    ///     A Hub for forwarding notifications to clients.
    /// </summary>
    [Authorize]
    public class NotificationsHub : Hub
    {
        private readonly IJobTracker jobTracker;

        /// <summary>
        ///     Initializes a new instance of the <see cref="NotificationsHub"/> class.
        /// </summary>
        public NotificationsHub(IJobTracker jobTracker)
        {
            jobTracker.ShouldNotBeNull(nameof(jobTracker));

            this.jobTracker = jobTracker;
        }

        /// <summary>
        ///     Hook fired when a connection first opens.
        /// </summary>
        public override async Task OnConnectedAsync()
        {
            await this.SyncAll().ConfigureAwait(false);
        }

        /// <summary>
        ///     Marks a job as seen. Remote Function Call.
        /// </summary>
        [HubMethodName(NotificationHubEvents.MarkJobRead)]
        public async Task MarkRead(BackgroundJob backgroundJob)
        {
            await this.jobTracker.SetJobIsReadAsync(backgroundJob.JobId, this.Context.UserIdentifier, true).ConfigureAwait(false);
        }

        /// <summary>
        ///     Marks a job as unseen. Remote Function Call.
        /// </summary>
        [HubMethodName(NotificationHubEvents.MarkJobUnread)]
        public async Task MarkUnread(BackgroundJob backgroundJob)
        {
            await this.jobTracker.SetJobIsReadAsync(backgroundJob.JobId, this.Context.UserIdentifier, false).ConfigureAwait(false);
        }

        /// <summary>
        ///     Resends all notifications.
        /// </summary>
        [HubMethodName(NotificationHubEvents.SyncAllJobs)]
        public async Task SyncAll()
        {
            var jobs = await this.jobTracker.GetUnreadJobsByUserAsync(this.Context.UserIdentifier).ConfigureAwait(true);
            var tasks = jobs.Select(job => this.Clients.Caller.SendAsync(NotificationHubEvents.UpdateJobState, job));
            await Task.WhenAll(tasks).ConfigureAwait(true);
        }
    }
}
