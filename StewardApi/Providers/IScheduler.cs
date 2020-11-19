using System;
using System.Threading;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Represents an interface for classes capable of scheduling
    ///     background work.
    /// </summary>
    public interface IScheduler
    {
        /// <summary>
        ///     Queues the specified action to be run in the background.
        /// </summary>
        /// <param name="workItem">The workItem.</param>
        void QueueBackgroundWorkItem(Action<CancellationToken> workItem);

        /// <summary>
        ///     Queues the specified function to be run in the background.
        /// </summary>
        /// <param name="workItem">The workItem.</param>
        void QueueBackgroundWorkItem(Func<CancellationToken, Task> workItem);
    }
}
