﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <summary>
    ///     Exposes methods for managing the Woodstock service.
    /// </summary>
    public interface IWoodstockServiceManagementProvider
    {
        /// <summary>
        ///     Gets LSP groups.
        /// </summary>
        Task<IList<LspGroup>> GetLspGroupsAsync(string endpoint);

        /// <summary>
        ///     Gets auction house block list.
        /// </summary>
        Task<IList<AuctionBlockListEntry>> GetAuctionBlockListAsync(int maxResults, string endpoint);

        /// <summary>
        ///     Adds entries to auction house block list.
        /// </summary>
        Task AddAuctionBlockListEntriesAsync(IList<AuctionBlockListEntry> blockListEntries, string endpoint);

        /// <summary>
        ///     Deletes entries from auction house block list.
        /// </summary>
        Task DeleteAuctionBlockListEntriesAsync(IList<int> carIds, string endpoint);
    }
}
