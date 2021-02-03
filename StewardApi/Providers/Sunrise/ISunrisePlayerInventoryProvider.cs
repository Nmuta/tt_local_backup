﻿using System.Collections.Generic;
using System.Threading.Tasks;
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
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        Task<SunrisePlayerInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get inventory profiles.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="SunriseInventoryProfile"/>.
        /// </returns>
        Task<IList<SunriseInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        Task<SunrisePlayerInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Get LSP groups.
        /// </summary>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="SunriseLspGroup"/>.
        /// </returns>
        Task<IList<SunriseLspGroup>> GetLspGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Update player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="gift">The gift to send.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdatePlayerInventoryAsync(ulong xuid, SunriseGift gift, string requestingAgent);

        /// <summary>
        ///     Update player inventories.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <param name="groupGift">The group gift to send.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdatePlayerInventoriesAsync(IList<ulong> xuids, SunriseGroupGift groupGift, string requestingAgent);

        /// <summary>
        ///     Updates LSP group inventories.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <param name="gift">The gift to send.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdateGroupInventoriesAsync(int groupId, SunriseGift gift, string requestingAgent);
    }
}
