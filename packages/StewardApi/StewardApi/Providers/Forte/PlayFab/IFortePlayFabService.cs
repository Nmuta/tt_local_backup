using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Forte;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;

namespace Turn10.LiveOps.StewardApi.Providers.Forte.PlayFab
{
    /// <summary>
    ///     Exposes methods for interacting with the PlayFab API.
    /// </summary>
    public interface IFortePlayFabService
    {
        /// <summary>
        ///     Gets all available PlayFab builds.
        /// </summary>
        Task<IList<PlayFabBuildSummary>> GetBuildsAsync(FortePlayFabEnvironment environment);

        /// <summary>
        ///     Gets PlayFab build. Else null if it doesn't exist.
        /// </summary>
        Task<PlayFabBuildSummary> GetBuildAsync(Guid buildId, FortePlayFabEnvironment environment);

        /// <summary>
        ///     Gets available voucher types from PlayFab currency lists.
        /// </summary>
        Task<IEnumerable<PlayFabVoucher>> GetVouchersAsync(FortePlayFabEnvironment environment);

        /// <summary>
        ///     Gets PlayFab player entity ids. Used to lookup and change player information.
        /// </summary>
        Task<Dictionary<ulong, PlayFabProfile>> GetPlayerEntityIdsAsync(IList<ulong> xuids, FortePlayFabEnvironment environment);

        /// <summary>
        ///     Gets PlayFab player's transaction history.
        /// </summary>
        Task<IEnumerable<PlayFabTransaction>> GetTransactionHistoryAsync(string playfabEntityId, PlayFabCollectionId collectionId, FortePlayFabEnvironment environment);

        /// <summary>
        ///     Gets PlayFab player's currency inventory.
        /// </summary>
        Task<IEnumerable<PlayFabInventoryItem>> GetPlayerCurrencyInventoryAsync(string playfabEntityId, PlayFabCollectionId collectionId, FortePlayFabEnvironment environment);

        /// <summary>
        ///     Adds currency to player's account.
        /// </summary>
        Task AddInventoryItemToPlayerAsync(string playfabEntityId, PlayFabCollectionId collectionId, string itemId, int amount, FortePlayFabEnvironment environment);

        /// <summary>
        ///     Removes currency from player's account.
        /// </summary>
        Task RemoveInventoryItemFromPlayerAsync(string playfabEntityId, PlayFabCollectionId collectionId, string itemId, int amount, FortePlayFabEnvironment environment);
    }
}
