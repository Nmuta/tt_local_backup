using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for retrieving and creating Steward users.
    /// </summary>
    public interface IScopedStewardUserProvider
    {
        /// <summary>
        ///     Retrieves a steward user.
        /// </summary>
        Task<StewardUserInternal> GetStewardUserAsync(string id);

        /// <summary>
        ///     Checks if a steward has a specific permission.
        /// </summary>
        Task<bool> HasPermissionsForAsync(HttpContext httpContext, string objectId, string attribute);
    }
}
