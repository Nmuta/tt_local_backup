using System;
using System.Linq;
using System.Security.Claims;

namespace Turn10.LiveOps.StewardApi.Common
{
    /// <summary>
    ///     Contains useful methods used throughout the codebase.
    /// </summary>
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        ///     Gets the user identifier.
        /// </summary>
        public static string GetNameIdentifier(this ClaimsPrincipal claimsPrincipal)
        {
            return claimsPrincipal.Identity.Name
                   ?? claimsPrincipal.Claims?.FirstOrDefault(x => x.Type.Equals("aud", StringComparison.OrdinalIgnoreCase))?.Value;
        }
    }
}
