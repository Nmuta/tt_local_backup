using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Custom authorize attribute that allows simpler role management.
    /// </summary>
    public class PolicyResultAuthorizationMiddleware : IAuthorizationMiddlewareResultHandler
    {
        private readonly IAuthorizationMiddlewareResultHandler handler;

        /// <summary>
        /// Initializes a new instance of the <see cref="PolicyResultAuthorizationMiddleware"/> class.
        /// </summary>
        public PolicyResultAuthorizationMiddleware()
        {
            this.handler = new AuthorizationMiddlewareResultHandler();
        }

        /// <inheritdoc/>
        public async Task HandleAsync(
            RequestDelegate requestDelegate,
            HttpContext httpContext,
            AuthorizationPolicy authorizationPolicy,
            PolicyAuthorizationResult policyAuthorizationResult)
        {
            if (policyAuthorizationResult?.Forbidden == true && httpContext != null)
            {
                if (policyAuthorizationResult.AuthorizationFailure?.FailureReasons.Where(failureReason => failureReason is AttributeFailureReason).FirstOrDefault() is AttributeFailureReason failureReason)
                {
                    httpContext.Response.StatusCode = failureReason.StatusCode;
                    await httpContext.Response.WriteAsync(failureReason.Message).ConfigureAwait(true);
                    return;
                }
            }

            await this.handler.HandleAsync(requestDelegate, httpContext, authorizationPolicy, policyAuthorizationResult).ConfigureAwait(true);
        }
    }
}