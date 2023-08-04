using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Web;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
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
            if (context == null)
            {
                return Task.CompletedTask;
            }

            if (requirement == null)
            {
                context.Fail(new AttributeFailureReason((int)HttpStatusCode.BadRequest, this, $"Null {nameof(requirement)} in policy handler."));
                return Task.CompletedTask;
            }

            if (string.IsNullOrEmpty(requirement.Attribute))
            {
                context.Fail(new AttributeFailureReason((int)HttpStatusCode.BadRequest, this, $"Null or empty {nameof(requirement.Attribute)} in policy handler."));
                return Task.CompletedTask;
            }

            if (!(context.Resource is HttpContext httpContext))
            {
                context.Fail(new AttributeFailureReason((int)HttpStatusCode.BadRequest, this, $"Invalid {nameof(context.Resource)} type."));
                return Task.CompletedTask;
            }

            if (context.HasFailed)
            {
                // Another policy has already failed
                return Task.CompletedTask;
            }

            var objectId = context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimConstants.ObjectId);
            if (objectId == null)
            {
                return Task.CompletedTask;
            }

            try
            {
                var hasPermissions = await this.stewardUserProvider.HasPermissionsForAsync(httpContext, objectId.Value, requirement.Attribute).ConfigureAwait(false);

                if (hasPermissions)
                {
                    context.Succeed(requirement);
                    return Task.CompletedTask;
                }
                else
                {
                    // Fail the context so any future policies can fail fast
                    context.Fail(new AttributeFailureReason((int)HttpStatusCode.Forbidden, this, $"Policy check failed."));
                    return Task.CompletedTask;
                }
            }
            catch (BadRequestStewardException ex)
            {
                context.Fail(new AttributeFailureReason((int)HttpStatusCode.BadRequest, this, ex.Message));
                return Task.CompletedTask;
            }
            catch (ForbiddenStewardException ex)
            {
                context.Fail(new AttributeFailureReason((int)HttpStatusCode.Forbidden, this, ex.Message));
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                context.Fail(new AttributeFailureReason((int)HttpStatusCode.InternalServerError, this, ex.Message));
                return Task.CompletedTask;
            }
        }
    }
}
