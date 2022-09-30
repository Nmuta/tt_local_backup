
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    public class AttributeAuthorizationHandler : AuthorizationHandler<AttributeRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AttributeRequirement requirement)
        {
            // Logic goes here to check if the user has the specified attribute
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