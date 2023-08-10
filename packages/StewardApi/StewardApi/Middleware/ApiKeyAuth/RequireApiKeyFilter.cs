using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Client;
using System.Net;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.ApiKeyAuth;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Middleware.ApiKeyAuth
{
    // <summary>
    ///     Requires a specific class of API Key to be present to proceed.
    /// </summary>
    public sealed class RequireApiKeyFilter : IAsyncActionFilter
    {
        private readonly AcceptableApiKeysFromAppSpecificKeyVaultConfig acceptableApiKeys;
        private readonly AcceptableApiKeysFromAppSpecificKeyVaultConfig.ApiKey apiKey;

        public RequireApiKeyFilter(
            AcceptableApiKeysFromAppSpecificKeyVaultConfig acceptableApiKeys,
            AcceptableApiKeysFromAppSpecificKeyVaultConfig.ApiKey apiKey)
        {
            this.acceptableApiKeys = acceptableApiKeys;
            this.apiKey = apiKey;
        }

        /// <inheritdoc/>
        public Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var secrets = this.acceptableApiKeys.GetAcceptableApiKeys(this.apiKey);
            var headerApiKey = context.HttpContext.Request.Headers[StandardHeaders.XApiKey];
            var requestHasAcceptableApiKey = secrets.Active.Contains(headerApiKey);

            var hostEnvironment = context.HttpContext.RequestServices.GetService<IHostEnvironment>();
            var bypassKeyCheck = hostEnvironment?.IsStewardApiLocal() ?? false;

            var acceptRequest = bypassKeyCheck || requestHasAcceptableApiKey;
            if (!acceptRequest)
            {
                throw new ApiKeyStewardException("The provided API key is rejected.");
            }

            return next();
        }
    }
}
