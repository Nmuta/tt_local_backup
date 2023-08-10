using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.ApiKeyAuth;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using static System.Net.Mime.MediaTypeNames;

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

        public async Task InvokeAsync(HttpContext context)
        {
            // Only use this middleware on our external api path
            // Ignore is running on localhost
            var hostEnvironment = context.RequestServices.GetService<IHostEnvironment>();
            var isExternalApiPath = context.Request?.Path.Value?.ToLowerInvariant().Contains("api/external") ?? false;

            var bypassDueTLocalEnvironment = hostEnvironment?.IsStewardApiLocal() ?? false;
            var bypassDueToSwagger = context.Request?.Path.Value?.ToLowerInvariant().Contains("swagger") ?? false;
            var bypassDueToHealthCheck = context.Request?.Path.Value?.ToLowerInvariant().Contains("api/health") ?? false;
            var bypassMiddleware = !isExternalApiPath || bypassDueTLocalEnvironment || bypassDueToSwagger || bypassDueToHealthCheck;
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

                var acceptableKeys = context.RequestServices.GetService<AcceptableApiKeysFromAppSpecificKeyVaultConfig>();
                var hasAnyAcceptableKey = acceptableKeys?.All.Active.Contains(apiKey) ?? false;
                if (!hasAnyAcceptableKey)
                {
                    throw new ApiKeyStewardException("The provided API key is rejected.");
                }
            }
            catch (StewardBaseException ex)
            {
                context.Response.StatusCode = (int) ex.StatusCode;
                var data = Encoding.UTF8.GetBytes(ex.Message);
                context.Response.ContentType = "text/plain";
                await context.Response.Body.WriteAsync(data, 0, data.Length);
                return;
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                var data = Encoding.ASCII.GetBytes("Unexpected auth exception occured");
                context.Response.ContentType = "text/plain";
                await context.Response.Body.WriteAsync(data, 0, data.Length);
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

