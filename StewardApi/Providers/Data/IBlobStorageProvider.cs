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
        ///     Gets Hello World executable.
        /// </summary>
        Task<string> GetHelloWorldAsync(string path, string fileName);

        /// <summary>
        ///     Gets tools availability.
        /// </summary>
        Task<ToolsAvailability> GetToolsAvailabilityAsync();

        /// <summary>
        ///     Sets tools availability.
        /// </summary>
        Task<ToolsAvailability> SetToolsAvailabilityAsync(ToolsAvailability updatedToolsAvailability);

        /// <summary>
        ///     Gets PlayFab settings.
        /// </summary>
        Task<StewardPlayFabSettings> GetStewardPlayFabSettingsAsync();

        /// <summary>
        ///     Sets PlayFab settings.
        /// </summary>
        Task<StewardPlayFabSettings> SetStewardPlayFabSettingsAsync(StewardPlayFabSettings updatedPlayFabSettings);
    }
}