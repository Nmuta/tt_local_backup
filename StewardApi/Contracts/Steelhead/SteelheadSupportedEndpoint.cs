using System.Reflection;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents an endpoint for use by Steelhead service wrapper.
    /// </summary>
    public static class SteelheadSupportedEndpoint
    {
        /// <summary>
        ///     Gets Steelhead development LSP endpoint.
        /// </summary>
        public static string Development
        {
            get => "https://Steelhead-Flight-12.dev.services.forzamotorsport.net/Services/o.xtsw";
        }

        /// <summary>
        ///     Converts endpoint key into endpoint.
        /// </summary>
        public static string GetEndpoint(string key)
        {
            key.ShouldNotBeNullEmptyOrWhiteSpace(nameof(key));

            var property = typeof(SteelheadSupportedEndpoint).GetProperty(key, BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (property == null)
            {
                throw new BadHeaderStewardException($"Failed to parse key: {key} for title: {TitleConstants.SteelheadCodeName}.");
            }

            var value = property.GetValue(null, null);

            return (string)value;
        }
    }
}
