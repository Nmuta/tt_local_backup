
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
    public class AttributeAuthorizationHandler : AuthorizationHandler<AttributeRequirement>
    {
        private readonly IScopedStewardUserProvider stewardUserProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AttributeAuthorizationHandler"/> class.
        /// </summary>
        public AttributeAuthorizationHandler(IScopedStewardUserProvider stewardUserProvider)
        {
            this.stewardUserProvider = stewardUserProvider;
        }

        /// <inheritdoc/>
        protected override async Task<Task> HandleRequirementAsync(AuthorizationHandlerContext context, AttributeRequirement requirement)
        {
            var objectId = context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimConstants.ObjectId);
            if (objectId == null)
            {
                throw new Exception("Invalid user claim");
            }

            // TODO: Pull auth attributes from user and verify against provided requirements
            var user = await this.stewardUserProvider.GetStewardUserAsync(objectId.Value).ConfigureAwait(false);

            if (context.HasFailed)
            {
                return Task.CompletedTask;
            }

            var attribute = requirement.Attribute;
            context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }

    public class AttributeRequirement : IAuthorizationRequirement
    {
        public string Attribute { get; private set; }

        public AttributeRequirement(string attribute) { Attribute = attribute; }
    }
}