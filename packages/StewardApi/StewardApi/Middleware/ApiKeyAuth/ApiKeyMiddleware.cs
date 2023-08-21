using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;

#pragma warning disable SA1402 // File may only contain a single type

namespace Turn10.LiveOps.StewardApi.Middleware.ApiKeyAuth
{
    /// <summary>
    ///     A middleware that requires that any valid API key be present to call an endpoint.
    /// </summary>
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate next;

        public ApiKeyMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        /// <summary>
        ///     Invokes ApiKeyMiddleware.
        /// </summary>
        public async Task InvokeAsync(HttpContext context)
        {
            // Only use this middleware on our external api path
            // Ignore if running on localhost
            var hostEnvironment = context.RequestServices.GetService<IHostEnvironment>();
            var isExternalApiPath = context.Request?.Path.Value?.ToLowerInvariant().Contains("api/v2/external", StringComparison.InvariantCultureIgnoreCase) ?? false;

            var bypassDueTLocalEnvironment = hostEnvironment?.IsStewardApiLocal() ?? false;
            var bypassMiddleware = !isExternalApiPath || bypassDueTLocalEnvironment;

            if (bypassMiddleware)
            {
                await this.next(context);
                return;
            }

            try
            {
                if (!context.Request.Headers.TryGetValue(StandardHeaders.XApiKey, out var apiKey))
                {
                    throw new ApiKeyStewardException("This API expects an auth key, but none was provided.");
                }

                if (string.IsNullOrWhiteSpace(apiKey))
                {
                    throw new ApiKeyStewardException("This API expects an auth key, but none was provided.");
                }

                var acceptableKeys = context.RequestServices.GetService<AcceptableApiKeysFromKeyVaultConfig>();
                var hasAnyAcceptableKey = acceptableKeys?.All.Active.Contains(apiKey) ?? false;
                if (!hasAnyAcceptableKey)
                {
                    throw new ApiKeyStewardException("The provided API key is rejected.");
                }
            }
            catch (StewardBaseException ex)
            {
                context.Response.StatusCode = (int)ex.StatusCode;
                var data = Encoding.UTF8.GetBytes(ex.Message);
                context.Response.ContentType = "text/plain";
                await context.Response.Body.WriteAsync(data);
                return;
            }
            catch (Exception)
            {
                context.Response.StatusCode = 500;
                var data = Encoding.ASCII.GetBytes("Unexpected auth exception occured");
                context.Response.ContentType = "text/plain";
                await context.Response.Body.WriteAsync(data);
                return;
            }

            await this.next(context);
        }
    }

    /// <summary>
    ///     Extension methods for activating <see cref="ApiKeyMiddleware"/>.
    /// </summary>
    public static class ApiKeyMiddlewareExtensions
    {
        /// <summary>
        ///     Activates <see cref="ApiKeyMiddleware"/>.
        /// </summary>
        public static IApplicationBuilder UseApiKeyMiddleware(
            this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ApiKeyMiddleware>();
        }
    }
}
