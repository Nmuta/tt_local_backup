﻿using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;
using Turn10.LiveOps.StewardApi.Contracts.ApiKeyAuth;
using static Turn10.LiveOps.StewardApi.Contracts.ApiKeyAuth.AcceptableApiKeysFromAppSpecificKeyVaultConfig;

namespace Turn10.LiveOps.StewardApi.Middleware.ApiKeyAuth
{
    /// <summary>
    ///     Requires a specific class of API Key to be present to proceed.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public sealed class RequireApiKeyAttribute : Attribute, IFilterFactory
    {
        private readonly ApiKey apiKey;

        /// <inheritdoc/>
        public bool IsReusable => true;

        public RequireApiKeyAttribute(ApiKey apiKey)
        {
            this.apiKey = apiKey;
        }

        /// <inheritdoc/>
        public IFilterMetadata CreateInstance(IServiceProvider serviceProvider)
        {
            return new RequireApiKeyFilter(
                serviceProvider.GetRequiredService<AcceptableApiKeysFromAppSpecificKeyVaultConfig>(),
                this.apiKey);
        }
    }
}
