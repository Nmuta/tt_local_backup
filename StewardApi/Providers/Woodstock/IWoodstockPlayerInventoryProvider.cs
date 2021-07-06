﻿using System.Collections.Generic;
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
        Task<WoodstockPlayerInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        Task<WoodstockPlayerInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Gets inventory profiles.
        /// </summary>
        Task<IList<WoodstockInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);

        /// <summary>
        ///     Gets the account inventory.
        /// </summary>
        Task<WoodstockAccountInventory> GetAccountInventoryAsync(ulong xuid);

        /// <summary>
        ///     Updates player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, WoodstockGift gift, string requesterObjectId, bool useAdminCreditLimit);

        /// <summary>
        ///     Updates player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(WoodstockGroupGift groupGift, string requesterObjectId, bool useAdminCreditLimit);

        /// <summary>
        ///     Updates group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(int groupId, WoodstockGift gift, string requesterObjectId, bool useAdminCreditLimit);
    }
}
