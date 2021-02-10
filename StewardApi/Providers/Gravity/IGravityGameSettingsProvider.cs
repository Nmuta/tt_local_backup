using System;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
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
        /// <param name="gameSettingsId">The game settings ID.</param>
        /// <returns>
        ///     An awaitable task.
        /// </returns>
        Task GetGameSettingsAsync(Guid gameSettingsId);
    }
}
