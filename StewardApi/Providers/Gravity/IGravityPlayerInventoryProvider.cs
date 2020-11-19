using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <summary>
    ///     Exposes methods for interacting with the Gravity player inventory.
    /// </summary>
    public interface IGravityPlayerInventoryProvider
    {
        /// <summary>
        ///     Get player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        Task<GravityPlayerInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        Task<GravityPlayerInventory> GetPlayerInventoryAsync(string t10Id);

        /// <summary>
        ///     Get player inventory by profile ID.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        Task<GravityPlayerInventory> GetPlayerInventoryAsync(ulong xuid, string profileId);

        /// <summary>
        ///     Get player inventory by profile ID.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        Task<GravityPlayerInventory> GetPlayerInventoryAsync(string t10Id, string profileId);

        /// <summary>
        ///     Create or replace a player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="grantStartingPackage">A value which indicates whether to grant starting package.</param>
        /// <param name="preserveBookingItems">A value which indicates whether to preserve booking items.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task CreateOrReplacePlayerInventoryAsync(
                                                 ulong xuid,
                                                 GravityPlayerInventory playerInventory,
                                                 string requestingAgent,
                                                 bool grantStartingPackage,
                                                 bool preserveBookingItems);

        /// <summary>
        ///     Create or replace a player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="grantStartingPackage">A value which indicates whether to grant starting package.</param>
        /// <param name="preserveBookingItems">A value which indicates whether to preserve booking items.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task CreateOrReplacePlayerInventoryAsync(
                                                 string t10Id,
                                                 GravityPlayerInventory playerInventory,
                                                 string requestingAgent,
                                                 bool grantStartingPackage,
                                                 bool preserveBookingItems);

        /// <summary>
        ///     Update a player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdatePlayerInventoryAsync(ulong xuid, GravityPlayerInventory playerInventory, string requestingAgent);

        /// <summary>
        ///     Update a player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdatePlayerInventoryAsync(string t10Id, GravityPlayerInventory playerInventory, string requestingAgent);

        /// <summary>
        ///     Delete player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task DeletePlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Delete player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task DeletePlayerInventoryAsync(string t10Id);
    }
}
