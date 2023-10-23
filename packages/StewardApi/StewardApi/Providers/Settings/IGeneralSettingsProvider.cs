using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Settings
{
    /// <summary>
    ///     Exposes methods for access general Steward settings.
    ///     Example: LSP Endpoints
    /// </summary>
    public interface IGeneralSettingsProvider
    {
        /// <summary>
        ///     Gets LSP endpoints.
        /// </summary>
        TitleEndpoints GetLspEndpoints();
    }
}
