using System.Collections;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents valid LSP endpoints for titles that support multiple.
    /// </summary>
    public sealed class TitleEndpoints
    {
        /// <summary>
        ///     Gets or sets the Apollo endpoints.
        /// </summary>
        public IEnumerable<LspEndpoint> Apollo { get; set; }

        /// <summary>
        ///     Gets or sets the Sunrise endpoints.
        /// </summary>
        public IEnumerable<LspEndpoint> Sunrise { get; set; }

        /// <summary>
        ///     Gets or sets the Woodstock endpoints.
        /// </summary>
        public IEnumerable<LspEndpoint> Woodstock { get; set; }

        /// <summary>
        ///     Gets or sets the Steelhead endpoints.
        /// </summary>
        public IEnumerable<LspEndpoint> Steelhead { get; set; }

    }
}
