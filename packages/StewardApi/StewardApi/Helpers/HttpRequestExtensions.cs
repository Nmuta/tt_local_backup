using System;
using System.Linq;
using Castle.Core.Internal;
using Microsoft.AspNetCore.Http;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Opus;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Helpers for Http Requests.
    /// </summary>
    public static class HttpRequestExtensions
    {
        /// <summary>
        ///    Retrieves endpoint value for request.
        /// </summary>
        public static string GetEndpoint(this HttpRequest request, TitleCodeName title)
        {
            var v1HeaderValue = GetV1EndpointHeaderValue(request, title);
            var v2HeaderValue = GetV2EndpointHeaderValue(request, title);

            string headerValue;
            if (v1HeaderValue.IsNullOrEmpty() && v2HeaderValue.IsNullOrEmpty())
            {
                headerValue = GetDefaultEndpoint(title);
            }
            else
            {
                headerValue = !v2HeaderValue.IsNullOrEmpty() ? v2HeaderValue : v1HeaderValue;
            }

            return GetEndpointFromKey(headerValue, title);
        }

        /// <summary>
        ///    Retrieves value for V1 endpoint header.
        /// </summary>
        private static string GetV1EndpointHeaderValue(HttpRequest request, TitleCodeName title)
        {
            var titleString = Enum.GetName(typeof(TitleCodeName), title);

            if (!request.Headers.TryGetValue("endpointKey", out var headerValue))
            {
                return string.Empty;
            }

            // Strip out title from "Title|Endpoint"
            var splitValue = headerValue.ToString().Split('|');
            var key = splitValue.ElementAtOrDefault(1);

            return key;
        }

        /// <summary>
        ///    Retrieves value for V2 title specific endpoint header.
        /// </summary>
        private static string GetV2EndpointHeaderValue(HttpRequest request, TitleCodeName title)
        {
            var titleString = Enum.GetName(typeof(TitleCodeName), title);

            if (!request.Headers.TryGetValue($"Endpoint-{titleString}", out var headerValue))
            {
                return string.Empty;
            }

            return headerValue;
        }

        private static string GetEndpointFromKey(string key, TitleCodeName title)
        {
            var result = string.Empty;
            switch (title)
            {
                case TitleCodeName.Opus: // Only one valid endpoint.
                    result = GetDefaultEndpoint(title);
                    break;

                case TitleCodeName.Apollo:
                    result = ApolloEndpoint.GetEndpoint(key);
                    break;

                case TitleCodeName.Sunrise:
                    result = SunriseEndpoint.GetEndpoint(key);
                    break;

                case TitleCodeName.Woodstock:
                    result = WoodstockEndpoint.GetEndpoint(key);
                    break;

                case TitleCodeName.Steelhead:
                    result = SteelheadEndpoint.GetEndpoint(key);
                    break;

                default: // Display the key if we can't find the URI.
                    result = GetDefaultEndpoint(title);
                    break;
            }

            return result;
        }

        private static string GetDefaultEndpoint(TitleCodeName title)
        {
            var result = string.Empty;
            switch (title)
            {
                case TitleCodeName.Opus:
                    result = OpusEndpoint.Retail;
                    break;

                case TitleCodeName.Apollo:
                    result = ApolloEndpoint.Retail;
                    break;

                case TitleCodeName.Sunrise:
                    result = SunriseEndpoint.Retail;
                    break;

                case TitleCodeName.Woodstock:
                    result = WoodstockEndpoint.Retail;
                    break;

                case TitleCodeName.Steelhead:
                    result = SteelheadEndpoint.Studio;
                    break;

                default:
                    result = "Unrecognized Title";
                    break;
            }

            return result;
        }
    }
}
