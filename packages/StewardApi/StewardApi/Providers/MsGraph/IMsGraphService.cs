using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Graph;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.MsGraph
{
    /// <summary>
    ///     Exposes methods for interacting with the Microsoft Graph API.
    /// </summary>
    public interface IMsGraphService
    {
        /// <summary>
        ///     Gets all AAD app users.
        /// </summary>
        /// <remarks>The users returned in this only contain their ObjectId, Name, & Role.</remarks>
        Task<IEnumerable<StewardUser>> GetAadAppUsersAsync();

        /// <summary>
        ///     Gets all AAD app roles.
        /// </summary>
        Task<IEnumerable<AppRole>> GetAadAppRolesAsync();

        /// <summary>
        ///     Gets user AAD profile.
        /// </summary>
        Task<User> GetAadUserAsync(string userId);
    }
}
