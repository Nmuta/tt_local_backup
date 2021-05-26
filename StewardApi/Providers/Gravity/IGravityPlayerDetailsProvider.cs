using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
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
        ///     Get player identity.
        /// </summary>
        Task<IdentityResultBeta> GetPlayerIdentityAsync(IdentityQueryBeta query);

        /// <summary>
        ///     Exposes methods for interacting with the Gravity player details.
        /// </summary>
        Task<GravityPlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Get player details.
        /// </summary>
        Task<GravityPlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Get player details.
        /// </summary>
        Task<GravityPlayerDetails> GetPlayerDetailsByT10IdAsync(string t10Id);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(string gamertag);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsByT10IdAsync(string t10Id);
    }
}
