using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///     Exposes methods for interacting with the Apollo player inventory.
    /// </summary>
    public interface IApolloPlayerInventoryProvider
    {
        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        Task<ApolloPlayerInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        Task<ApolloPlayerInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        Task<IList<ApolloInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);

        /// <summary>
        ///     Updates player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, ApolloGift gift, string requesterObjectId, bool useAdminCreditLimit);

        /// <summary>
        ///     Updates player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(ApolloGroupGift groupGift, string requesterObjectId, bool useAdminCreditLimit);

        /// <summary>
        ///     UpdatesS group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(int groupId, ApolloGift gift, string requesterObjectId, bool useAdminCreditLimit);
    }
}
