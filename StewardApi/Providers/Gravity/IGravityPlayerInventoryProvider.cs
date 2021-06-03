using System;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <summary>
    ///     Exposes methods for interacting with the Gravity player inventory.
    /// </summary>
    public interface IGravityPlayerInventoryProvider
    {
        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<GravityPlayerInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<GravityPlayerInventory> GetPlayerInventoryAsync(string t10Id);

        /// <summary>
        ///     Get player inventory by profile ID.
        /// </summary>
        Task<GravityPlayerInventory> GetPlayerInventoryAsync(ulong xuid, string profileId);

        /// <summary>
        ///     Get player inventory by profile ID.
        /// </summary>
        Task<GravityPlayerInventory> GetPlayerInventoryAsync(string t10Id, string profileId);

        /// <summary>
        ///     Sends inventory item gifts to a player.
        /// </summary>
        Task<GiftResponse<string>> UpdatePlayerInventoryAsync(string t10Id, Guid gameSettingsId, GravityGift gift, string requesterObjectId, bool useAdminCurrencyLimit);
    }
}
