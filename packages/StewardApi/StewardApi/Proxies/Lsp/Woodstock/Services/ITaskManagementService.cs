using System.Threading.Tasks;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.Services.LiveOps.FH5_main.Generated.TaskManagementService;

#pragma warning disable VSTHRD200 // Use Async Suffix

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services
{
    /// <summary>
    ///     Proxy interface for <see cref="TaskManagementService"/>.
    /// </summary>
    public interface ITaskManagementService
    {
        /// <summary>
        ///     Get tasks.
        /// </summary>
        Task<GetTasksOutput> GetTasks();

        /// <summary>
        ///     Update a specific task.
        /// </summary>
        Task UpdateTask(ForzaTaskUpdateParameters task);
    }
}
