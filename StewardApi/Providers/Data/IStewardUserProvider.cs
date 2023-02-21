using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

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
        Task CreateStewardUserAsync(StewardUser user);

        /// <summary>
        ///     Creates a steward user.
        /// </summary>
        Task CreateStewardUserAsync(string id, string name, string email, string role, string attributes, string team);

        /// <summary>
        ///     Updates a steward user.
        /// </summary>
        Task UpdateStewardUserAsync(StewardUser user);

        /// <summary>
        ///     Updates a steward user.
        /// </summary>
        Task UpdateStewardUserAsync(string id, string name, string email, string role, string attributes, string team);

        /// <summary>
        ///     Retrieves a steward user.
        /// </summary>
        Task<StewardUserInternal> GetStewardUserAsync(string id);

        /// <summary>
        ///     Ensures user updated.
        /// </summary>
        Task EnsureStewardUserAsync(StewardClaimsUser user);

        /// <summary>
        ///     Ensures user updated.
        /// </summary>
        Task EnsureStewardUserAsync(string id, string name, string email, string role);

        /// <summary>
        ///     Gets all Steward users.
        /// </summary>
        Task<IEnumerable<StewardUserInternal>> GetAllStewardUsersAsync();
    }
}
