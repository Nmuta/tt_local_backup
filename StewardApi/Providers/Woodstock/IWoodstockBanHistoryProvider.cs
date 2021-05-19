﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <summary>
    ///     Exposes methods for interacting with the Woodstock ban history.
    /// </summary>
    public interface IWoodstockBanHistoryProvider
    {
        /// <summary>
        ///     Updates ban history.
        /// </summary>
        Task UpdateBanHistoryAsync(ulong xuid, string title, string requesterObjectId, WoodstockBanParameters banParameters);

        /// <summary>
        ///     Gets ban histories.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetBanHistoriesAsync(ulong xuid, string title);
    }
}