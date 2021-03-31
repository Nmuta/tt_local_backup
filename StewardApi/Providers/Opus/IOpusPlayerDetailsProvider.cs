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
        Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query);

        /// <summary>
        ///     Get player details.
        /// </summary>
        Task<OpusPlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Get player details.
        /// </summary>
        Task<OpusPlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid);
    }
}
