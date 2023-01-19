using System.Reflection;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Forte
{
    /// <summary>
    ///     Represents an endpoint for use by Forte service wrapper.
    /// </summary>
    public static class ForteEndpoint
    {
        /// <summary>
        ///     The default value for V1 endpoint key header.
        /// </summary>
        public const string V1Default = "Forte|Studio";

        /// <summary>
        ///     The default value for V2 endpoint key header.
        /// </summary>
        public const string V2Default = "Studio";

        /// <summary>
        ///     Gets studio LSP endpoint.
        /// </summary>
        public static string Studio => "Unavailable";

        /// <summary>
        ///     Converts endpoint key into endpoint.
        /// </summary>
        public static string GetEndpoint(string key)
        {
            key.ShouldNotBeNullEmptyOrWhiteSpace(nameof(key));

            var property = typeof(ForteEndpoint).GetProperty(key, BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (property == null)
            {
                throw new BadHeaderStewardException($"Failed to parse key: {key} for title: {TitleConstants.ForteCodeName}.");
            }

            var value = property.GetValue(null, null);

            return (string)value;
        }
    }
}
