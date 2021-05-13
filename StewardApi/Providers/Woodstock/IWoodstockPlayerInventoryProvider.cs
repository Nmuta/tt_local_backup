using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <summary>
    ///     Exposes methods for interacting with the Woodstock player inventory.
    /// </summary>
    public interface IWoodstockPlayerInventoryProvider
    {
        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<WoodstockPlayerInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<WoodstockPlayerInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Get inventory profiles.
        /// </summary>
        Task<IList<WoodstockInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);

        /// <summary>
        ///     Update player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, WoodstockGift gift, string requestingAgent, bool useAdminCreditLimit);

        /// <summary>
        ///     Update player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(WoodstockGroupGift groupGift, string requestingAgent, bool useAdminCreditLimit);

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(int groupId, WoodstockGift gift, string requestingAgent, bool useAdminCreditLimit);
    }
}
