using System;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
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
        ///     The <see cref="GravityPlayerInventoryBeta"/>.
        /// </returns>
        Task<GravityPlayerInventoryBeta> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventoryBeta"/>.
        /// </returns>
        Task<GravityPlayerInventoryBeta> GetPlayerInventoryAsync(string t10Id);

        /// <summary>
        ///     Get player inventory by profile ID.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventoryBeta"/>.
        /// </returns>
        Task<GravityPlayerInventoryBeta> GetPlayerInventoryAsync(ulong xuid, string profileId);

        /// <summary>
        ///     Get player inventory by profile ID.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventoryBeta"/>.
        /// </returns>
        Task<GravityPlayerInventoryBeta> GetPlayerInventoryAsync(string t10Id, string profileId);

        /// <summary>
        ///     Sends inventory item gifts to a player.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <param name="gameSettingsId">The game settings ID.</param>
        /// <param name="gift">The gift to send.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     The <see cref="GiftResponse{T}"/>.
        /// </returns>
        Task<GiftResponse<string>> UpdatePlayerInventoryAsync(string t10Id, Guid gameSettingsId, GravityGift gift, string requestingAgent);
    }
}
