using Microsoft.AspNetCore.Authorization;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Custom authorize attribute that allows simpler role management.
    /// </summary>
    public sealed class AuthorizeRolesAttribute : AuthorizeAttribute
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="AuthorizeRolesAttribute"/> class.
        /// </summary>
        /// <param name="roles">Array of roles.</param>
        public AuthorizeRolesAttribute(params string[] roles)
            : base()
        {
            this.Roles = string.Join(",", roles);
        }
    }
}
