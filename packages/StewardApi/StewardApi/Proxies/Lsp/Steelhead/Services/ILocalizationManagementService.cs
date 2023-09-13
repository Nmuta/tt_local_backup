using System.Threading.Tasks;
using Turn10.Services.LiveOps.FM8.Generated;
using LocalizationManagementService = Turn10.Services.LiveOps.FM8.Generated.LocalizationManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    /// <summary>
    ///     Manages localization. Proxy for Client object.
    /// </summary>
    public interface ILocalizationManagementService
    {
        /// <summary>
        ///     Adds string to be localized in Pegasus pipeline.
        /// </summary>
        Task<LocalizationManagementService.AddStringToLocalizeOutput> AddStringToLocalize(
            ForzaLocalizedStringData localizedStringData);
    }
}
