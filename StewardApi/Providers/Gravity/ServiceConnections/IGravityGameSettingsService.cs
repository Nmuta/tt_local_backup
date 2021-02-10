using System;
using System.Threading.Tasks;
using Forza.WebServices.FMG.Generated;
using static Forza.WebServices.FMG.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <summary>
    ///      Exposes methods for interacting with the Gravity User Service.
    /// </summary>
    public interface IGravityGameSettingsService
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
