using System;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Middleware.ApiKeyAuth
{
    /// <summary>
    ///     Requires a specific API Key to be present to proceed.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public sealed class RequireApiKeyAttribute : Attribute, IFilterFactory
    {
        private readonly StewardApiKey apiKey;

        /// <inheritdoc/>
        public bool IsReusable => true;

        /// <summary>
        ///     Gets the API key name
        /// </summary>
        /// <returns></returns>
        public string ApiKeyName() => this.apiKey.GetDescription();

        public RequireApiKeyAttribute(StewardApiKey apiKey)
        {
            this.apiKey = apiKey;
        }

        /// <inheritdoc/>
        public IFilterMetadata CreateInstance(IServiceProvider serviceProvider)
        {
            return new RequireApiKeyFilter(
                serviceProvider.GetRequiredService<AcceptableApiKeysFromKeyVaultConfig>(),
                this.apiKey);
        }
    }
}
