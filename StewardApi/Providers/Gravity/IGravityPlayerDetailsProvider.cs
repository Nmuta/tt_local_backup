using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <summary>
    ///     Exposes methods for interacting with the Gravity player details.
    /// </summary>
    public interface IGravityPlayerDetailsProvider
    {
        /// <summary>
        ///     Gets player identity.
        /// </summary>
        Task<IdentityResultBeta> GetPlayerIdentityAsync(IdentityQueryBeta query);

        /// <summary>
        ///     Exposes methods for interacting with the Gravity player details.
        /// </summary>
        Task<GravityPlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<GravityPlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<GravityPlayerDetails> GetPlayerDetailsByT10IdAsync(string t10Id);

        /// <summary>
        ///     Ensures a player exists.
        /// </summary>
        Task<bool> DoesPlayerExistAsync(ulong xuid);

        /// <summary>
        ///     Ensures a player exists.
        /// </summary>
        Task<bool> DoesPlayerExistAsync(string gamertag);

        /// <summary>
        ///     Ensures a player exists.
        /// </summary>
        Task<bool> DoesPlayerExistByT10IdAsync(string t10Id);
    }
}
