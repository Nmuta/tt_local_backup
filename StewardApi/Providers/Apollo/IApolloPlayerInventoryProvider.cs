using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///      Exposes methods for interacting with the Apollo player inventory.
    /// </summary>
    public interface IApolloPlayerInventoryProvider
    {
        /// <summary>
        ///     Get player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="ApolloPlayerInventory"/>.
        /// </returns>
        Task<ApolloPlayerInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     A list of <see cref="ApolloInventoryProfile"/>.
        /// </returns>
        Task<IList<ApolloInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        /// <param name="profileId">The Profile ID.</param>
        /// <returns>
        ///     The <see cref="ApolloPlayerInventory"/>.
        /// </returns>
        Task<ApolloPlayerInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Update player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="gift">The gift to send.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdatePlayerInventoryAsync(ulong xuid, ApolloGift gift, string requestingAgent);

        /// <summary>
        ///     Update player inventories.
        /// </summary>
        /// <param name="groupGift">The group gift to send.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdatePlayerInventoriesAsync(ApolloGroupGift groupGift, string requestingAgent);

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <param name="gift">The gift to send.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdateGroupInventoriesAsync(int groupId, ApolloGift gift, string requestingAgent);
    }
}
