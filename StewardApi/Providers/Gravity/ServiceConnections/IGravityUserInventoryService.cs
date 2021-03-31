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
        Task<LiveOpsGetInventoryByProfileIdOutput> LiveOpsGetInventoryByProfileIdAsync(string t10Id, string profileId);

        /// <summary>
        ///      Gets user inventory.
        /// </summary>
        Task<LiveOpsGetUserInventoryOutput> LiveOpsGetUserInventoryAsync(string t10Id);

        /// <summary>
        ///      Gets user inventory by t10Id.
        /// </summary>
        Task<LiveOpsGetUserInventoryByT10IdOutput> LiveOpsGetUserInventoryByT10IdAsync(string t10Id);

        /// <summary>
        ///      Resets user inventory.
        /// </summary>
        Task ResetUserInventoryAsync(string t10Id);

        /// <summary>
        ///     Grants an item to a player's inventory.
        /// </summary>
        Task LiveOpsGrantItem(string t10Id, Guid gameSettingsId, ForzaUserInventoryItemType type, int id, int quantity);
    }
}
