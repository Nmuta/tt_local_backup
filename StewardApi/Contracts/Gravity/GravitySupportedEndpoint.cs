using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents an endpoint for use by Gravity service wrapper.
    /// </summary>
    /// <remarks>Only used to define string for input in Gravity Gift History.</remarks>
    public static class GravitySupportedEndpoint
    {
        /// <summary>
        ///     Gets Gravity development LSP endpoint.
        /// </summary>
        public static string Retail
        {
            get => "https://gameservices.street.forzamotorsport.net/Services/o.xtsw";
        }
    }
}
