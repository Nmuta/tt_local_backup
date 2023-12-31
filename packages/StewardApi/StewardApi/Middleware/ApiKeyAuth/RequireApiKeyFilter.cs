﻿using System.Threading.Tasks;
using Castle.Core.Internal;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Middleware.ApiKeyAuth
{
    /// <summary>
    ///     Requires a specific class of API Key to be present to proceed.
    /// </summary>
    public sealed class RequireApiKeyFilter : IAsyncActionFilter
    {
        private readonly AcceptableApiKeysFromKeyVaultConfig acceptableApiKeys;
        private readonly StewardApiKey apiKey;

        public RequireApiKeyFilter(
            AcceptableApiKeysFromKeyVaultConfig acceptableApiKeys,
            StewardApiKey apiKey)
        {
            this.acceptableApiKeys = acceptableApiKeys;
            this.apiKey = apiKey;
        }

        /// <inheritdoc/>
        public Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var hostEnvironment = context.HttpContext.RequestServices.GetService<IHostEnvironment>();
            var bypassKeyCheck = hostEnvironment?.IsStewardApiLocal() ?? false;
            if (bypassKeyCheck)
            {
                return next();
            }

            var secrets = this.acceptableApiKeys.GetAcceptableApiKeys(this.apiKey);
            var headerApiKey = context.HttpContext.Request.Headers[StandardHeaders.XApiKey];
            if (headerApiKey.IsNullOrEmpty())
            {
                throw new ApiKeyStewardException("No API key was provided in the request.");
            }

            var requestHasAcceptableApiKey = secrets.Active.Contains(headerApiKey);
            if (!requestHasAcceptableApiKey)
            {
                throw new ApiKeyStewardException("The provided API key is rejected.");
            }

            return next();
        }
    }
}
