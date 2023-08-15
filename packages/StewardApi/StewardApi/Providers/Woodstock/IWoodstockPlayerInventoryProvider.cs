using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;

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
            WoodstockProxyBundle proxyService);

        /// <summary>
        ///     Updates player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(
            WoodstockGroupGift groupGift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            WoodstockProxyBundle proxyService);

        /// <summary>
        ///     Updates group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(
            int groupId,
            WoodstockGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            WoodstockProxyBundle proxyService);

        /// <summary>
        ///    Sends car livery to a player xuid.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> SendCarLiveryAsync(ExpirableGroupGift groupGift, UgcItem livery, string requesterObjectId, WoodstockProxyBundle proxyService);

        /// <summary>
        ///    Sends car livery to a user group.
        /// </summary>
        Task<GiftResponse<int>> SendCarLiveryAsync(ExpirableGift gift, int groupId, UgcItem livery, string requesterObjectId, WoodstockProxyBundle proxyService);
    }
}
