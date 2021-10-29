using System.Reflection;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an endpoint for use by Apollo service wrapper.
    /// </summary>
    public static class ApolloEndpoint
    {
        /// <summary>
        ///     Gets Apollo production LSP endpoint.
        /// </summary>
        public static string Retail
        {
            get => "https://serverservices.fm7.forzamotorsport.net/ServerServices.FM7Release/o.xtsw";
        }

        /// <summary>
        ///     Gets Apollo studio LSP endpoint.
        /// </summary>
        public static string Studio
        {
            get => "https://test-ss.fm7.forzamotorsport.net/ServerServices.FM7/o.xtsw";
        }

        /// <summary>
        ///     Converts endpoint key into endpoint.
        /// </summary>
        public static string GetEndpoint(string key)
        {
            key.ShouldNotBeNullEmptyOrWhiteSpace(nameof(key));

            var property = typeof(ApolloEndpoint).GetProperty(key, BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (property == null)
            {
                throw new BadHeaderStewardException($"Failed to parse key: {key} for title: {TitleConstants.ApolloCodeName}.");
            }

            var value = property.GetValue(null, null);

            return (string)value;
        }
    }
}
