using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Hubs
{
    /// <summary>
    ///     Maps a SignalR request's user into a string.
    /// </summary>
    public class UserIdProvider : IUserIdProvider
    {
        /// <summary>
        ///     Gets a User ID for a given request.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns>The User ID.</returns>
        public string GetUserId(HubConnectionContext context)
        {
            var claims = context?.User?.UserClaims();
            return claims?.ObjectId;
        }
    }
}
