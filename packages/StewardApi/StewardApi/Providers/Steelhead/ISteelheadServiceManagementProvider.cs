using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SteelheadLiveOpsContent;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using LiveOpsContracts = Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <summary>
    ///     Exposes methods for managing the Steelhead service.
    /// </summary>
    public interface ISteelheadServiceManagementProvider
    {
        /// <summary>
        ///     Gets LSP groups.
        /// </summary>
        Task<IList<LspGroup>> GetLspGroupsAsync(string endpoint);

        /// <summary>
        ///     Submits string to Pegasus for localization.
        /// </summary>
        Task<Guid> AddStringToLocalizeAsync(LocalizedStringData data, string endpoint);

        /// <summary>
        ///     Retrieves a collection of supported locales.
        /// </summary>
        Task<IEnumerable<SupportedLocale>> GetSupportedLocalesAsync();

        /// <summary>
        ///     Gets localized strings.
        /// </summary>
        Task<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>> GetLocalizedStringsAsync();
    }
}
