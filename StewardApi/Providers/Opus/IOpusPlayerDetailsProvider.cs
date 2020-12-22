using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Opus;

namespace Turn10.LiveOps.StewardApi.Providers.Opus
{
    /// <summary>
    ///     Exposes methods for interacting with the Opus player details.
    /// </summary>
    public interface IOpusPlayerDetailsProvider
    {
        /// <summary>
        ///     Get player identity.
        /// </summary>
        /// <param name="query">The query.</param>
        /// <returns>
        ///     The <see cref="IdentityResultAlpha"/>.
        /// </returns>
        Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query);

        /// <summary>
        ///     Get player details.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="OpusPlayerDetails"/>.
        /// </returns>
        Task<OpusPlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Get player details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="OpusPlayerDetails"/>.
        /// </returns>
        Task<OpusPlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     A value indicating if the player exists.
        /// </returns>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid);
    }
}
