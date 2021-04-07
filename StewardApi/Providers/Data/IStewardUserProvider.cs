using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for retrieving and creating Steward users.
    /// </summary>
    public interface IStewardUserProvider
    {
        /// <summary>
        ///     Creates a steward user.
        /// </summary>
        Task CreateStewardUserAsync(StewardUserClaims user);

        /// <summary>
        ///     Creates a steward user.
        /// </summary>
        Task CreateStewardUserAsync(string id, string name, string email);

        /// <summary>
        ///     Updates a steward user.
        /// </summary>
        Task UpdateStewardUserAsync(StewardUserClaims user);

        /// <summary>
        ///     Updates a steward user.
        /// </summary>
        Task UpdateStewardUserAsync(string id, string name, string email);

        /// <summary>
        ///     Retrieves a steward user.
        /// </summary>
        Task<StewardUser> GetStewardUserAsync(string id);

        /// <summary>
        ///     Unsure user updated.
        /// </summary>
        Task EnsureStewardUserAsync(StewardUserClaims user);

        /// <summary>
        ///     Unsure user updated.
        /// </summary>
        Task EnsureStewardUserAsync(string id, string name, string email);
    }
}
