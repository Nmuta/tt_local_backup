﻿using System.Collections.Generic;

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

        /// <summary>
        ///     Gets or sets the Forte endpoints.
        /// </summary>
        public IEnumerable<LspEndpoint> Forte { get; set; }

        /// <summary>
        ///     Gets or sets the Forum endpoints. This is a stub to treat Forum as a game title. 
        /// </summary>
        /// <remarks>This is a stub to treat Forum as a game title. Will only ever have 'Retail' endpoint.</remarks>
        public IEnumerable<LspEndpoint> Forum { get; set; }
    }
}
