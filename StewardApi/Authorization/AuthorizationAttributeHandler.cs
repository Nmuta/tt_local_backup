using System;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Kusto.Cloud.Platform.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Web;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Verify user authorization attributes.
    /// </summary>
    /// <remarks>Throws unauthorized exception if user attributes are unmet.</remarks>
    public class AuthorizationAttributeHandler : AuthorizationHandler<AttributeRequirement>
    {
        private readonly IScopedStewardUserProvider stewardUserProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AuthorizationAttributeHandler"/> class.
        /// </summary>
        public AuthorizationAttributeHandler(IScopedStewardUserProvider stewardUserProvider)
        {
            this.stewardUserProvider = stewardUserProvider;
        }

        /// <inheritdoc/>
        protected override async Task<Task> HandleRequirementAsync(AuthorizationHandlerContext context, AttributeRequirement requirement)
        {
            if (context == null || requirement == null || context.HasFailed || !(context.Resource is HttpContext httpContext))
            {
                return Task.CompletedTask;
            }

            // If the user is in any of the v1 roles, succeed the policy
            // TODO: Once all users are migrated to auth v2, remove this
            // PBI: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1349616
            if (UserRole.V1Roles().Any(role => context.User.IsInRole(role)))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            if (!EnvironmentAndTitle(httpContext, out string title, out string environment))
            {
                return Task.CompletedTask;
            }

            var objectId = context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimConstants.ObjectId);
            if (objectId == null)
            {
                return Task.CompletedTask;
            }

            StewardUserInternal user = null;

            try
            {
                user = await this.stewardUserProvider.GetStewardUserAsync(objectId.Value).ConfigureAwait(false);
            }
            catch
            {
                return Task.CompletedTask;
            }

            var authorized = user.AuthorizationAttributes().Where(authAttr =>
                    Equals(authAttr.Environment, environment) &&
                    Equals(authAttr.Title, title) &&
                    Equals(authAttr.Attribute, requirement.Attribute));

            if (authorized.Any())
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            // Fail the context so any future policies can fail fast
            context.Fail();
            return Task.CompletedTask;

            bool Equals(string str, string attr)
            {
                return str.Equals(attr, StringComparison.OrdinalIgnoreCase);
            }

            bool EnvironmentAndTitle(HttpContext httpContext, out string title, out string environment)
            {
                title = RequestPathSegment(httpContext.Request.Path, "title", true);
                var api = RequestPathSegment(httpContext.Request.Path, "api");
                environment = string.Empty;

                if (string.IsNullOrEmpty(title))
                {
                    return true;
                }

                // v1 apis use endpointKey, value is Title|environment
                // v2 apis use Endpoint-Title, value is environment
                var environmentKey = "v1".Equals(api) ? "endpointKey" : $"Endpoint-{title}";

                if (!httpContext.Request.Headers.TryGetValue(environmentKey, out var env))
                {
                    return false;
                }

                if (env.IsNullOrEmpty())
                {
                    return false;
                }

                environment = env.ToString().Contains("|") ? env.ToString().Split("|")[1] : env;

                return true;
            }

            string RequestPathSegment(PathString path, string key, bool capitalize = false)
            {
                if (path == null)
                {
                    return string.Empty;
                }

                var segments = path.ToUriComponent().Split("/");

                var index = segments.IndexOf(segment => string.Equals(segment, key, StringComparison.OrdinalIgnoreCase)) + 1;
                if (index >= segments.Length || index == 0)
                {
                    return string.Empty;
                }

                var segment = segments[index];

                return capitalize ? char.ToUpper(segment[0]) + segment[1..] : segment;
            }
        }
    }

    /// <summary>
    /// User attribute to check.
    /// </summary>
    public class AttributeRequirement : IAuthorizationRequirement
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AttributeRequirement"/> class.
        /// </summary>
        /// <param name="attribute">attribute</param>
        public AttributeRequirement(string attribute) { Attribute = attribute; }

        /// <summary>
        /// Attribute.
        /// </summary>
        public string Attribute { get; private set; }
    }
}