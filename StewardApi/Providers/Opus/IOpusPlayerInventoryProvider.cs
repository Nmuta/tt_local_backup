using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Opus;

namespace Turn10.LiveOps.StewardApi.Providers.Opus
{
    /// <summary>
    ///     Exposes methods for interacting with the Opus player inventory.
    /// </summary>
    public interface IOpusPlayerInventoryProvider
    {
        /// <summary>
        ///     Get player inventory details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="OpusPlayerInventory"/>.
        /// </returns>
        Task<OpusMasterInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory details.
        /// </summary>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="OpusPlayerInventory"/>.
        /// </returns>
        Task<OpusMasterInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Gets an inventory profile summary.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="OpusInventoryProfile"/>.
        /// </returns>
        Task<IList<OpusInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);
    }
}
