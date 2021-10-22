using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Opus;

namespace Turn10.LiveOps.StewardApi.Providers.Opus
{
    /// <summary>
    ///     Exposes methods for interacting with the Opus player details.
    /// </summary>
    public interface IOpusPlayerDetailsProvider
    {
        /// <summary>
        ///     Gets player identity.
        /// </summary>
        Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<OpusPlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<OpusPlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Ensures a player exists.
        /// </summary>
        Task<bool> DoesPlayerExistAsync(ulong xuid);
    }
}
