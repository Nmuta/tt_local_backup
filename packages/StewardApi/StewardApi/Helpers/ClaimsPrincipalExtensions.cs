using System.Security.Claims;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.Services.Authentication;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for <see cref="ClaimsPrincipal"/>.
    /// </summary>
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        ///     Generates a user model from claims principal.
        /// </summary>
        public static StewardClaimsUser UserClaims(this ClaimsPrincipal user)
        {
            // TODO: this type should probably wrap the ClaimsPrincipal rather than constructing a POCO, or this method should be a static-type method ctor like StewardUser.FromClaims(...). Either option will lend itself to easier extensibility in the future
            return new StewardClaimsUser
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
                    : "Email not found",
            };
        }
    }
}
