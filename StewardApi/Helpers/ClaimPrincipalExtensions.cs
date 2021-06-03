using System.Security.Claims;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.Services.Authentication;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for <see cref="ClaimsPrincipal"/>.
    /// </summary>
    public static class ClaimPrincipalExtensions
    {
        /// <summary>
        ///     Generates a user model from claims principal.
        /// </summary>
        public static StewardUser UserClaims(this ClaimsPrincipal user)
        {
            return new StewardUser
            {
                ObjectId = user.HasClaimType("http://schemas.microsoft.com/identity/claims/objectidentifier")
                    ? user.GetClaimValue("http://schemas.microsoft.com/identity/claims/objectidentifier")
                    : null,
                Name = user.HasClaimType("name")
                    ? user.GetClaimValue("name")
                    : "Name not found",
                Role = user.HasClaimType(ClaimTypes.Role)
                    ? user.GetClaimValue(ClaimTypes.Role)
                    : "none",
                EmailAddress = user.HasClaimType(ClaimTypes.Email)
                    ? user.GetClaimValue(ClaimTypes.Email)
                    : "Email not found"
            };
        }
    }
}
