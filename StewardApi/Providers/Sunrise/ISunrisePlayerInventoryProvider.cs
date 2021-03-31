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
        Task<SunriseMasterInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<SunriseMasterInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Get inventory profiles.
        /// </summary>
        Task<IList<SunriseInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);

        /// <summary>
        ///     Get LSP groups.
        /// </summary>
        Task<IList<SunriseLspGroup>> GetLspGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Update player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, SunriseGift gift, string requestingAgent, bool useAdminCreditLimit);

        /// <summary>
        ///     Update player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(SunriseGroupGift groupGift, string requestingAgent, bool useAdminCreditLimit);

        /// <summary>
        ///     Updates LSP group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(int groupId, SunriseGift gift, string requestingAgent, bool useAdminCreditLimit);
    }
}
