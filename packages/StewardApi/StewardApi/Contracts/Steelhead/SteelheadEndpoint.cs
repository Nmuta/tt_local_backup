﻿using System.Reflection;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents an endpoint for use by Steelhead service wrapper.
    /// </summary>
    public static class SteelheadEndpoint
    {
        /// <summary>
        ///     The default value for V1 endpoint key header.
        /// </summary>
        public const string V1Default = "Steelhead|Retail";

        /// <summary>
        ///     The default value for V2 endpoint key header.
        /// </summary>
        public const string V2Default = "Retail";

        /// <summary>
        ///     Gets prod LSP endpoint.
        /// </summary>
        public static string Retail => "https://gameservices.fm.forzamotorsport.net/Services/o.xtsw";

        /// <summary>
        ///     Gets studio LSP endpoint.
        /// </summary>
        public static string Studio => "https://steelhead-final.dev.services.forzamotorsport.net/Services/o.xtsw";

        /// <summary>
        ///     Converts endpoint key into endpoint.
        /// </summary>
        public static string GetEndpoint(string key)
        {
            key.ShouldNotBeNullEmptyOrWhiteSpace(nameof(key));

            var property = typeof(SteelheadEndpoint).GetProperty(key, BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (property == null)
            {
                throw new BadHeaderStewardException($"Failed to parse key: {key} for title: {TitleConstants.SteelheadCodeName}.");
            }

            var value = property.GetValue(null, null);

            return (string)value;
        }
    }
}
