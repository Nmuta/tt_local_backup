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
        ///     Gets inventory profiles.
        /// </summary>
        Task<IList<SteelheadInventoryProfile>> GetInventoryProfilesAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Updates player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(
            ulong xuid,
            SteelheadGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint);

        /// <summary>
        ///     Updates player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(
            SteelheadGroupGift groupGift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint);

        /// <summary>
        ///     Updates group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(
            int groupId,
            SteelheadGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint);
    }
}
