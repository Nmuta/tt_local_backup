using Microsoft.AspNetCore.SignalR;
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
        public string GetUserId(HubConnectionContext connection)
        {
            var claims = connection?.User?.UserClaims();
            return claims?.ObjectId;
        }
    }
}
