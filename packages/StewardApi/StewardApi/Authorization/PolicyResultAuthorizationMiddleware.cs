using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

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
            RequestDelegate next,
            HttpContext context,
            AuthorizationPolicy policy,
            PolicyAuthorizationResult authorizeResult)
        {
            if (authorizeResult?.Forbidden == true && context != null)
            {
                if (authorizeResult.AuthorizationFailure?.FailureReasons.Where(failureReason => failureReason is AttributeFailureReason).FirstOrDefault() is AttributeFailureReason failureReason)
                {
                    context.Response.StatusCode = failureReason.StatusCode;
                    await context.Response.WriteAsync(failureReason.Message).ConfigureAwait(true);
                    return;
                }
            }

            await this.handler.HandleAsync(next, context, policy, authorizeResult).ConfigureAwait(true);
        }
    }
}
