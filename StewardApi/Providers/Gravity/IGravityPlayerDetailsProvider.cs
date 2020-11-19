using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <summary>
    ///     Exposes methods for interacting with the Gravity player details.
    /// </summary>
    public interface IGravityPlayerDetailsProvider
    {
        /// <summary>
        ///     Exposes methods for interacting with the Gravity player details.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerDetails"/>.
        /// </returns>
        Task<GravityPlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Get player details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerDetails"/>.
        /// </returns>
        Task<GravityPlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Get player details.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerDetails"/>.
        /// </returns>
        Task<GravityPlayerDetails> GetPlayerDetailsByT10IdAsync(string t10Id);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     A value indicating whether the player exists.
        /// </returns>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     A value indicating whether the player exists.
        /// </returns>
        Task<bool> EnsurePlayerExistsAsync(string gamertag);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     A value indicating whether the player exists.
        /// </returns>
        Task<bool> EnsurePlayerExistsByT10IdAsync(string t10Id);
    }
}
