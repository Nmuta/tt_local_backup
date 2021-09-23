﻿using System.Reflection;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents an endpoint for use by Sunrise service wrapper.
    /// </summary>
    public static class SunriseEndpoint
    {
        /// <summary>
        ///     Gets Sunrise production LSP endpoint.
        /// </summary>
        public static string Retail
        {
            get => "https://gameservices.fh4.forzamotorsport.net/Services/o.xtsw";
        }

        /// <summary>
        ///     Gets Sunrise studio LSP endpoint.
        /// </summary>
        // TODO uncomment after player chip work is in: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/850499
        //public static string Studio
        //{
        //    get => "https://test-gs.fh4.forzamotorsport.net/Services/o.xtsw";
        //}

        /// <summary>
        ///     Converts endpoint key into endpoint.
        /// </summary>
        public static string GetEndpoint(string key)
        {
            key.ShouldNotBeNullEmptyOrWhiteSpace(nameof(key));

            var property = typeof(SunriseEndpoint).GetProperty(key, BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (property == null)
            {
                throw new BadHeaderStewardException($"Failed to parse key: {key} for title: {TitleConstants.SunriseCodeName}.");
            }

            var value = property.GetValue(null, null);

            return (string)value;
        }
    }
}
