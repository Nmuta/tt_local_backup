using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with the Sunrise player inventory.
    /// </summary>
    public interface ISunrisePlayerInventoryProvider
    {
        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        Task<SunrisePlayerInventory> GetPlayerInventoryAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        Task<SunrisePlayerInventory> GetPlayerInventoryAsync(int profileId, string endpoint);

        /// <summary>
        ///     Gets inventory profiles.
        /// </summary>
        Task<IList<SunriseInventoryProfile>> GetInventoryProfilesAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets the account inventory.
        /// </summary>
        Task<SunriseAccountInventory> GetAccountInventoryAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Updates player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(
            ulong xuid,
            SunriseGift gift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint);

        /// <summary>
        ///     Updates player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(
            SunriseGroupGift groupGift,
            string requesterObjectId,
            bool useAdminCreditLimit,
            string endpoint);

        /// <summary>
        ///     Updates LSP group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(
            int groupId,
            SunriseGift gift,
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
