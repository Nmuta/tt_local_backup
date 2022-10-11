using System;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Kusto.Cloud.Platform.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Verify user auth attributes.
    /// </summary>
    /// <remarks>Throws unauthorized exception if user attributes are unmet.</remarks>
    public class AuthorizationAttributeHandler : AuthorizationHandler<AttributeRequirement>
    {
        private readonly IScopedStewardUserProvider stewardUserProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AttributeAuthorizationHandler"/> class.
        /// </summary>
        public AuthorizationAttributeHandler(IScopedStewardUserProvider stewardUserProvider)
        {
            this.stewardUserProvider = stewardUserProvider;
        }

        /// <inheritdoc/>
        protected override async Task<Task> HandleRequirementAsync(AuthorizationHandlerContext context, AttributeRequirement requirement)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            // Another policy has already failed
            if (context.HasFailed)
            {
                return Task.CompletedTask;
            }

            if (!(context.Resource is HttpContext httpContext))
            {
                return Task.CompletedTask;
            }

            EnvironmentAndTitle(httpContext, out string title, out string environment);

            if (requirement == null)
            {
                throw new ArgumentNullException(nameof(requirement));
            }

            var objectId = context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimConstants.ObjectId);
            if (objectId == null)
            {
                throw new Exception("Invalid user claim");
            }

            var user = await this.stewardUserProvider.GetStewardUserAsync(objectId.Value).ConfigureAwait(false);

            var authorizationAttributes = user.AuthorizationAttributes();

            var attributesForThisEnvironmentAndTitle = authorizationAttributes.Where(authAttr => EmptyOrEquals(authAttr.Environment, environment) && EmptyOrEquals(authAttr.Title, title));

            var authorized = attributesForThisEnvironmentAndTitle.Where(authAttr => EmptyOrEquals(authAttr.Attribute, requirement.Attribute));

            if (authorized.Any() || requirement.Attribute.Equals(UserAttribute.TestAction))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            context.Fail();
            return Task.CompletedTask;

            bool EmptyOrEquals(string str, string attr)
            {
                return str.Length == 0 || str.Equals(attr);
            }
        }

        private static void EnvironmentAndTitle(HttpContext httpContext, out string title, out string environment)
        {
            var requestPathSegments = httpContext.Request.Path.ToUriComponent().Split("/");
            var titleIndex = requestPathSegments.IndexOf(segment => segment.ToLower() == "title") + 1; // Plus to get segment after 'title'
            if (titleIndex >= requestPathSegments.Length)
            {
                // TODO: Not all apis will have a title, should we assume empty title and environment in that case?
                title = string.Empty;
                environment = string.Empty;
                return;
                // throw new BadHttpRequestException("No title provided.");
            }

            title = requestPathSegments[titleIndex];
            var titleCapitalized = char.ToUpper(title[0]) + title.Substring(1);
            var envKey = $"Endpoint-{titleCapitalized}";

            if (!httpContext.Request.Headers.TryGetValue(envKey, out var env))
            {
                throw new BadHttpRequestException("No environment provided.");
            }

            if (env.IsNullOrEmpty())
            {
                throw new BadHttpRequestException("No environment provided.");
            }

            environment = env;
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