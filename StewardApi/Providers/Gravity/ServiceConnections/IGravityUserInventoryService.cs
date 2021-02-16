using System;
using System.Threading.Tasks;
using Forza.WebServices.FMG.Generated;
using static Forza.WebServices.FMG.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <summary>
    ///     Exposes methods for interacting with the Gravity User Inventory Service.
    /// </summary>
    public interface IGravityUserInventoryService
    {
        /// <summary>
        ///      Gets user inventory by profile ID.
        /// </summary>
        /// <param name="t10Id">The t10Id.</param>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetInventoryByProfileIdOutput"/>.
        /// </returns>
        Task<LiveOpsGetInventoryByProfileIdOutput> LiveOpsGetInventoryByProfileIdAsync(string t10Id, string profileId);

        /// <summary>
        ///      Gets user inventory.
        /// </summary>
        /// <param name="t10Id">The T10 ID.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetUserInventoryOutput"/>.
        /// </returns>
        Task<LiveOpsGetUserInventoryOutput> LiveOpsGetUserInventoryAsync(string t10Id);

        /// <summary>
        ///      Gets user inventory by t10Id.
        /// </summary>
        /// <param name="t10Id">The T10 ID.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetUserInventoryByT10IdOutput"/>.
        /// </returns>
        Task<LiveOpsGetUserInventoryByT10IdOutput> LiveOpsGetUserInventoryByT10IdAsync(string t10Id);

        /// <summary>
        ///      Resets user inventory.
        /// </summary>
        /// <param name="t10Id">The T10 ID.</param>
        /// <returns>
        ///     A task with a status.</returns>
        Task ResetUserInventoryAsync(string t10Id);

        /// <summary>
        ///     Grants an item to a player's inventory.
        /// </summary>
        /// <param name="t10Id">The player's T10 ID.</param>
        /// <param name="gameSettingsId">The game settings ID.</param>
        /// <param name="type">The type of an inventory item.</param>
        /// <param name="id">The item ID.</param>
        /// <param name="quantity">The quantity of the item.</param>
        /// <returns>
        ///      A task with a status.
        /// </returns>
        Task LiveOpsGrantItem(string t10Id, Guid gameSettingsId, ForzaUserInventoryItemType type, int id, int quantity);
    }
}
