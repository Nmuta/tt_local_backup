using System.Security.Claims;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.Services.Authentication;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for use in Steward.
    /// </summary>
    public static class StewardExtensionMethods
    {
        /// <summary>
        ///     Generates a user model from claims principal.
        /// </summary>
        /// <param name="user">The user to generate the model for.</param>
        /// <returns>
        ///     The <see cref="StewardUser"/>.
        /// </returns>
        public static StewardUser UserModel(this ClaimsPrincipal user)
        {
            var stewardUser = new StewardUser
            {
                Name = user.HasClaimType("name")
                       ? user.GetClaimValue("name")
                       : null,
                Role = user.HasClaimType(ClaimTypes.Role)
                       ? user.GetClaimValue(ClaimTypes.Role)
                       : "none",
                EmailAddress = user.HasClaimType(ClaimTypes.Email)
                               ? user.GetClaimValue(ClaimTypes.Email)
                               : null,
                Id = user.HasClaimType("http://schemas.microsoft.com/identity/claims/objectidentifier")
                     ? user.GetClaimValue("http://schemas.microsoft.com/identity/claims/objectidentifier")
                     : null
            };

            return stewardUser;
        }
    }
}
