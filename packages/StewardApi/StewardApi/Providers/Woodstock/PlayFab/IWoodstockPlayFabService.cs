﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab
{
    /// <summary>
    ///     Exposes methods for interacting with the PlayFab API.
    /// </summary>
    public interface IWoodstockPlayFabService
    {
        /// <summary>
        ///     Gets all available PlayFab builds.
        /// </summary>
        Task<IList<PlayFabBuildSummary>> GetBuildsAsync(WoodstockPlayFabEnvironment environment);

        /// <summary>
        ///     Gets PlayFab build. Else null if it doesn't exist.
        /// </summary>
        Task<PlayFabBuildSummary> GetBuildAsync(Guid buildId, WoodstockPlayFabEnvironment environment);

        /// <summary>
        ///     Gets available voucher types from PlayFab currency lists.
        /// </summary>
        Task<IEnumerable<PlayFabVoucher>> GetVouchersAsync(WoodstockPlayFabEnvironment environment);

        /// <summary>
        ///     Gets PlayFab player entity ids. Used to lookup and change player information.
        /// </summary>
        Task<Dictionary<ulong, PlayFabProfile>> GetPlayerEntityIdsAsync(IList<ulong> xuids, WoodstockPlayFabEnvironment environment);

        /// <summary>
        ///     Gets PlayFab player's transaction history.
        /// </summary>
        Task<IEnumerable<PlayFabTransaction>> GetTransactionHistoryAsync(string playfabEntityId, WoodstockPlayFabEnvironment environment);

        /// <summary>
        ///     Adds currency to player's account.
        /// </summary>
        Task AddInventoryItemToPlayerAsync(string playfabEntityId, string itemId, int amount, WoodstockPlayFabEnvironment environment);

        /// <summary>
        ///     Removes currency from player's account.
        /// </summary>
        Task RemoveInventoryItemFromPlayerAsync(string playfabEntityId, string itemId, int amount, WoodstockPlayFabEnvironment environment);
    }
}
