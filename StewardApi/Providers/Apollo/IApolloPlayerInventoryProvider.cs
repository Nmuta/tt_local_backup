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
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdatePlayerInventoryAsync(ulong xuid, ApolloPlayerInventory playerInventory, string requestingAgent);

        /// <summary>
        ///     Update player inventories.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdatePlayerInventoriesAsync(IList<ulong> xuids, ApolloPlayerInventory playerInventory, string requestingAgent);

        /// <summary>
        ///     Update player inventories.
        /// </summary>
        /// <param name="gamertags">The gamertags.</param>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdatePlayerInventoriesAsync(IList<string> gamertags, ApolloPlayerInventory playerInventory, string requestingAgent);

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdateGroupInventoriesAsync(int groupId, ApolloPlayerInventory playerInventory, string requestingAgent);
    }
}
