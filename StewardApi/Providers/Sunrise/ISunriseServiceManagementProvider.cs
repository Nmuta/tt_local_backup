using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for managing the Sunrise service.
    /// </summary>
    public interface ISunriseServiceManagementProvider
    {
        /// <summary>
        ///     Gets LSP groups.
        /// </summary>
        Task<IList<LspGroup>> GetLspGroupsAsync(string endpoint);

        /// <summary>
        ///     Gets auction house blocklist.
        /// </summary>
        Task<IList<AuctionBlocklistEntry>> GetAuctionBlocklistAsync(int maxResults, string endpoint);

        /// <summary>
        ///     Adds entries to auction house blocklist.
        /// </summary>
        Task AddAuctionBlocklistEntriesAsync(IList<AuctionBlocklistEntry> blocklistEntries, string endpoint);

        /// <summary>
        ///     Deletes entries from auction house blocklist.
        /// </summary>
        Task DeleteAuctionBlocklistEntriesAsync(IList<int> carIds, string endpoint);
    }
}
