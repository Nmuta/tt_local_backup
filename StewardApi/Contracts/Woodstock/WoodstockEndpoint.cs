using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Http;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents an endpoint for use by Woodstock service wrapper.
    /// </summary>
    public static class WoodstockEndpoint
    {
        /// <summary>
        ///     The default value for V1 endpoint key header.
        /// </summary>
        public const string V1Default = "Woodstock|Retail";

        /// <summary>
        ///     The default value for V2 endpoint key header.
        /// </summary>
        public const string V2Default = "Retail";

        /// <summary>
        ///     Gets Woodstock retail LSP endpoint.
        /// </summary>
        public static string Retail => "https://liveops.fh5.forzamotorsport.net/Services/o.xtsw";

        /// <summary>
        ///     Gets Woodstock studio LSP endpoint.
        /// </summary>
        public static string Studio => "https://woodstock-final.dev.services.forzamotorsport.net/Services/o.xtsw";

        /// <summary>
        ///     Gets the endpoint from request headers, else default.
        /// </summary>
        public static string GetEndpoint(IHeaderDictionary headers)
        {
            if (!headers.TryGetValue("endpointKey", out var headerValue))
            {
                headerValue = V1Default;
            }

            var endpointKeyValue = headerValue.ToString();
            endpointKeyValue.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpointKeyValue));

            var splitValue = endpointKeyValue.Split('|');
            var title = splitValue.ElementAtOrDefault(0);
            var key = splitValue.ElementAtOrDefault(1);

            if (title != TitleConstants.WoodstockCodeName)
            {
                throw new BadHeaderStewardException(
                    $"Endpoint key designated for title: {title}, but expected {TitleConstants.WoodstockCodeName}.");
            }

            return WoodstockEndpoint.GetEndpoint(key);
        }

        /// <summary>
        ///     Converts endpoint key into endpoint.
        /// </summary>
        public static string GetEndpoint(string endpointKey)
        {
            endpointKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpointKey));

            var property = typeof(WoodstockEndpoint).GetProperty(endpointKey, BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (property == null)
            {
                throw new BadHeaderStewardException($"Failed to parse key: {endpointKey} for title: {TitleConstants.WoodstockCodeName}.");
            }

            var value = property.GetValue(null, null);

            return (string)value;
        }
    }
}
