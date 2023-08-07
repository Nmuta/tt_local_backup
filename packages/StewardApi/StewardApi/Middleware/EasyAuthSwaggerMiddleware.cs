using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace Turn10.LiveOps.StewardApi.Middleware
{
    /// <summary>
    ///     A middleware for enforcing easy auth login before viewing swagger endpoints.
    /// </summary>
    public sealed class EasyAuthSwaggerMiddleware
    {
        private const string PrincipalId = "X-MS-CLIENT-PRINCIPAL-ID";
        private const string AuthMeEndPoint = @"/.auth/me";
        private const string AuthLoginPath = @"/.auth/login/aad?post_login_redirect_url=/swagger/index.html";
        private const string UserClaimsKey = "user_claims";
        private const string ClaimTypeKey = "typ";
        private const string ClaimValueKey = "val";

        private readonly RequestDelegate next;

        /// <summary>
        ///     Initializes a new instance of the <see cref="EasyAuthSwaggerMiddleware"/> class.
        /// </summary>
        public EasyAuthSwaggerMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        /// <summary>
        ///     Invokes the Easy Auth Swagger middleware.
        /// </summary>
        [SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "Scope is entire request lifetime")]
        public async Task InvokeAsync(HttpContext context)
        {
            var uriString = $"{context.Request.Scheme}://{context.Request.Host}";

            if (!context.Request.Path.Value.Contains("swagger", StringComparison.InvariantCultureIgnoreCase)
                || context.Request.Host.Value.Contains("localhost", StringComparison.InvariantCultureIgnoreCase))
            {
                await this.next(context).ConfigureAwait(true);
                return;
            }

            if (!context.Request.Headers.ContainsKey(PrincipalId))
            {
                context.Response.Redirect($"{uriString}{AuthLoginPath}");
                return;
            }

            var cookieContainer = new CookieContainer();

            foreach (var c in context.Request.Cookies)
            {
                cookieContainer.Add(new Uri(uriString), new Cookie(c.Key, c.Value));
            }

            var handler = new HttpClientHandler()
            {
                CookieContainer = cookieContainer
            };

            var jsonResult = string.Empty;
            using (var client = new HttpClient(handler))
            {
                var res = await client.GetAsync($"{uriString}{AuthMeEndPoint}").ConfigureAwait(true);
                jsonResult = await res.Content.ReadAsStringAsync().ConfigureAwait(true);
            }

            if (string.IsNullOrEmpty(jsonResult))
            {
                context.Response.Redirect($"{uriString}{AuthLoginPath}");
                return;
            }

            try
            {
                var obj = JArray.Parse(jsonResult);

                var claims = new List<Claim>();
                foreach (var claim in obj[0][UserClaimsKey])
                {
                    claims.Add(new Claim(claim[ClaimTypeKey].ToString(), claim[ClaimValueKey].ToString()));
                }

                if (!claims.Any())
                {
                    context.Response.Redirect($"{uriString}{AuthLoginPath}");
                    return;
                }
            }
            catch
            {
                context.Response.Redirect($"{uriString}{AuthLoginPath}");
                return;
            }

            await this.next(context).ConfigureAwait(true);
        }
    }
}
