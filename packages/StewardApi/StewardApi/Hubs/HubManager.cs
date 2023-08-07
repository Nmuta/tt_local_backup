using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Hubs
{
    /// <summary>
    ///     Manages hub context.
    /// </summary>
    public class HubManager
    {
        private readonly IHubContext<NotificationsHub> hubContext;

        /// <summary>
        ///     Initializes a new instance of the <see cref="HubManager"/> class.
        /// </summary>
        public HubManager(
            IHubContext<NotificationsHub> hubContext)
        {
            hubContext.ShouldNotBeNull(nameof(hubContext));
            this.hubContext = hubContext;
        }

        /// <summary>
        ///     Forwards a job change event to the relevant clients.
        /// </summary>
        public async Task ForwardJobChange(BackgroundJobInternal job)
        {
            var client = this.hubContext.Clients.User(job.ObjectId);
            if (client != null)
            {
                await client.SendAsync(NotificationHubEvents.UpdateJobState, job).ConfigureAwait(false);
            }
        }
    }
}
