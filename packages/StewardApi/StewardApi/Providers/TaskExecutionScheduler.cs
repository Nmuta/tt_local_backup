using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     A scheduler implementation that executes the given work on a
    ///     background thread.
    /// </summary>
    /// <seealso cref="IScheduler" />
    [SuppressMessage("Usage", "VSTHRD110:Observe result of async calls", Justification = "Fire and forget by design.")]
    public sealed class TaskExecutionScheduler : IScheduler
    {
        /// <summary>
        ///     Queues the specified function to be run in the background.
        /// </summary>
        public void QueueBackgroundWorkItem(Func<CancellationToken, Task> workItem)
        {
            workItem.ShouldNotBeNull(nameof(workItem));

            Task.Run(() => workItem(CancellationToken.None));
        }

        /// <summary>
        ///     Queues the specified action to be run in the background.
        /// </summary>
        public void QueueBackgroundWorkItem(Action<CancellationToken> workItem)
        {
            workItem.ShouldNotBeNull(nameof(workItem));

            Task.Run(() => workItem(CancellationToken.None));
        }
    }
}
