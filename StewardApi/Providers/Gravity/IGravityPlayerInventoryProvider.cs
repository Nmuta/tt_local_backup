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
        ///     Update a player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <param name="masterInventory">The player inventory.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     <see cref="GravityGiftingMasterInventoryResponse"/>.
        /// </returns>
        Task<GravityGiftingMasterInventoryResponse> UpdatePlayerInventoryAsync(string t10Id, GravityMasterInventory masterInventory, string requestingAgent);

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
