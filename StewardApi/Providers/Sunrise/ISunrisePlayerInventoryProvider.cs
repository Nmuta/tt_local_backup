using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with the Sunrise player inventory.
    /// </summary>
    public interface ISunrisePlayerInventoryProvider
    {
        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<SunrisePlayerInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<SunrisePlayerInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Get inventory profiles.
        /// </summary>
        Task<IList<SunriseInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);

        /// <summary>
        ///     Get LSP groups.
        /// </summary>
        Task<IList<LspGroup>> GetLspGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Update player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, SunriseGift gift, string requesterObjectId, bool useAdminCreditLimit);

        /// <summary>
        ///     Update player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(SunriseGroupGift groupGift, string requesterObjectId, bool useAdminCreditLimit);

        /// <summary>
        ///     Updates LSP group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(int groupId, SunriseGift gift, string requesterObjectId, bool useAdminCreditLimit);
    }
}
