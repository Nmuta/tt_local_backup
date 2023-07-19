using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.V2
{
    /// <summary>
    ///     Exposes methods for managing the Steelhead service.
    /// </summary>
    public interface ISteelheadServiceManagementProvider
    {
        /// <summary>
        ///     Gets all user groups.
        /// </summary>
        Task<IList<LspGroup>> GetUserGroupsAsync(SteelheadProxyBundle services);
    }
}
