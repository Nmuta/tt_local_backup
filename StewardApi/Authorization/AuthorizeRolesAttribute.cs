using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Custom authorize attribute that allows simpler role management.
    /// </summary>
    public sealed class AuthorizeRolesAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private string[] Tags;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AuthorizeRolesAttribute"/> class.
        /// </summary>
        public AuthorizeRolesAttribute(params string[] roles)
            : base()
        {
            this.Roles = string.Join(",", roles);
        }

        /// <summary>
        ///    Initializes a new instance of the <see cref="AuthorizeRolesAttribute"/> class.
        ///    TODO: might not need role, we can assume everyone has the role 'User' which grants all permissions?
        /// </summary>
        public AuthorizeRolesAttribute(string role, params string[] tags)
            : base()
        {
            this.Roles = role; // TODO: remove this and set Roles to a single role, such as 'User'?
            this.Tags = tags;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (context == null)
            {
                return;
            }

            // TODO: Here is where we should do stuff...
            bool authorized = true;

            if (!authorized)
            {
                context.Result = new StatusCodeResult((int)System.Net.HttpStatusCode.Forbidden);
            }
        }
    }
}
