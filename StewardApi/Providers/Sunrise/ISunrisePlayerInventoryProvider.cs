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
        Task<SunrisePlayerInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        Task<SunrisePlayerInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Gets inventory profiles.
        /// </summary>
        Task<IList<SunriseInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);

        /// <summary>
        ///     Gets the account inventory.
        /// </summary>
        Task<SunriseAccountInventory> GetAccountInventoryAsync(ulong xuid);

        /// <summary>
        ///     Update player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, SunriseGift gift, string requesterObjectId, bool useAdminCreditLimit);

        /// <summary>
        ///     Updates player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(SunriseGroupGift groupGift, string requesterObjectId, bool useAdminCreditLimit);

        /// <summary>
        ///     Updates LSP group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(int groupId, SunriseGift gift, string requesterObjectId, bool useAdminCreditLimit);
    }
}
