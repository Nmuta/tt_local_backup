using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.V2
{
    /// <summary>
    ///     Exposes methods for interacting with the Steelhead player inventory.
    /// </summary>
    public interface ISteelheadPlayerInventoryProvider
    {
        /// <summary>
        ///     Gets inventory profiles.
        /// </summary>
        Task<IList<SteelheadInventoryProfile>> GetInventoryProfilesAsync(
            SteelheadProxyBundle service,
            ulong xuid);

        /// <summary>
        ///     Updates player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(
            SteelheadProxyBundle service,
            ulong xuid,
            SteelheadGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit);

        /// <summary>
        ///     Updates player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(
            SteelheadProxyBundle service,
            SteelheadGroupGift groupGift,
            string requesterObjectId,
            bool useAdminCreditLimit);

        /// <summary>
        ///     Updates group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(
            SteelheadProxyBundle service,
            int groupId,
            SteelheadGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit);

        /// <summary>
        ///    Sends car livery to a player xuid.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> SendCarLiveryAsync(
            SteelheadProxyBundle service,
            LocalizedMessageExpirableGroupGift groupGift,
            UgcItem livery,
            string requesterObjectId);

        /// <summary>
        ///    Sends car livery to a user group.
        /// </summary>
        Task<GiftResponse<int>> SendCarLiveryAsync(
            SteelheadProxyBundle service,
            LocalizedMessageExpirableGift gift,
            int groupId,
            UgcItem livery,
            string requesterObjectId);
    }
}
