using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <summary>
    ///     Exposes methods for interacting with the Woodstock player inventory.
    /// </summary>
    public interface IWoodstockPlayerInventoryProvider
    {
        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        Task<WoodstockPlayerInventory> GetPlayerInventoryAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        Task<WoodstockPlayerInventory> GetPlayerInventoryAsync(int profileId, string endpoint);

        /// <summary>
        ///     Gets inventory profiles.
        /// </summary>
        Task<IList<WoodstockInventoryProfile>> GetInventoryProfilesAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets the account inventory.
        /// </summary>
        Task<WoodstockAccountInventory> GetAccountInventoryAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Updates player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(
            ulong xuid,
            WoodstockGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint);

        /// <summary>
        ///     Updates player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(
            WoodstockGroupGift groupGift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint);

        /// <summary>
        ///     Updates group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(
            int groupId,
            WoodstockGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint);

        /// <summary>
        ///    Sends car livery to a player xuid.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> SendCarLiveryAsync(GroupGift groupGift, UgcItem livery, string requesterObjectId, string endpoint);

        /// <summary>
        ///    Sends car livery to a user group.
        /// </summary>
        Task<GiftResponse<int>> SendCarLiveryAsync(Gift gift, int groupId, UgcItem livery, string requesterObjectId, string endpoint);

    }
}
