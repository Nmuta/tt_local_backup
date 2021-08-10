using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///     Exposes methods for managing the Apollo service.
    /// </summary>
    public interface IApolloServiceManagementProvider
    {
        /// <summary>
        ///     Gets LSP groups.
        /// </summary>
        Task<IList<LspGroup>> GetLspGroupsAsync(int startIndex, int maxResults);
    }
}
