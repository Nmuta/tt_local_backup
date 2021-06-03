using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <summary>
    ///     Exposes methods for interacting with the Steelhead player inventory.
    /// </summary>
    public interface ISteelheadPlayerInventoryProvider
    {
        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<SteelheadPlayerInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<SteelheadPlayerInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Get inventory profiles.
        /// </summary>
        Task<IList<SteelheadInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);

        /// <summary>
        ///     Update player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, SteelheadGift gift, string requesterObjectId, bool useAdminCreditLimit);

        /// <summary>
        ///     Update player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(SteelheadGroupGift groupGift, string requesterObjectId, bool useAdminCreditLimit);

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(int groupId, SteelheadGift gift, string requesterObjectId, bool useAdminCreditLimit);
    }
}
