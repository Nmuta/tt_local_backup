using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for interacting with blob storage.
    /// </summary>
    public interface IBlobStorageProvider
    {
        /// <summary>
        ///     Gets tools availability.
        /// </summary>
        Task<ToolsAvailability> GetToolsAvailabilityAsync();

        /// <summary>
        ///     Sets tools availability.
        /// </summary>
        Task<ToolsAvailability> SetToolsAvailabilityAsync(ToolsAvailability updatedToolsAvailability);
    }
}