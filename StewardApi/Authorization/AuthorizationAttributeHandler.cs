using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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

            if (requirement == null)
            {
                throw new ArgumentNullException(nameof(requirement));
            }

            var objectId = context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimConstants.ObjectId);
            if (objectId == null)
            {
                throw new Exception("Invalid user claim");
            }

            // Another policy has already failed
            if (context.HasFailed)
            {
                return Task.CompletedTask;
            }

            var user = await this.stewardUserProvider.GetStewardUserAsync(objectId.Value).ConfigureAwait(false);
            string environment = "Retail"; // TODO
            string title = "Apollo"; // TODO

            var authorizationAttributes = user.AuthorizationAttributes();

            var attributesForThisEnvironmentAndTitle = authorizationAttributes.Where(authAttr => EmptyOrEquals(authAttr.Environment, environment) && EmptyOrEquals(authAttr.Title, title));

            var authorized = attributesForThisEnvironmentAndTitle.Where(authAttr => EmptyOrEquals(authAttr.Attribute, requirement.Attribute));

            if (authorized.Any())
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            else
            {
                // TODO:
                // Explicity fail the policy? This would create an and satement between the policies.
                // If we do not fail the context, we will have an or statement.
                // context.Fail();
            }

            return Task.CompletedTask;

            bool EmptyOrEquals(string str, string attr)
            {
                return str.Length == 0 || str.Equals(attr);
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