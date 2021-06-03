using System;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <summary>
    ///     Exposes methods for interacting with the Gravity game settings service.
    /// </summary>
    public interface IGravityGameSettingsProvider
    {
        /// <summary>
        ///     Get the the game settings.
        /// </summary>
        Task<GravityMasterInventory> GetGameSettingsAsync(Guid gameSettingsId);
    }
}
