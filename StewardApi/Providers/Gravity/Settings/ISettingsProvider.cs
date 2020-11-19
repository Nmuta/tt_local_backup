using System;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity.Settings
{
    using Client = Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings;

    /// <summary>
    ///     Represents a settings provider.
    /// </summary>
    public interface ISettingsProvider
    {
        /// <summary>
        ///     Get game settings.
        /// </summary>
        /// <param name="id">The ID.</param>
        /// <returns>
        ///     The <see cref="Client.GameSettings"/>.
        /// </returns>
        Task<Client.GameSettings> GetGameSettingAsync(Guid id);
    }
}
