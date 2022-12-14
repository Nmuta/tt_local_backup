using System;
using Microsoft.AspNetCore.Routing.Constraints;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents game-wide UGC search filters.
    /// </summary>
    public sealed class UgcSearchFilters
    {
        /// <summary>
        ///     Gets or sets the Keywords.
        /// </summary>
        public ulong Xuid { get; set; } = UgcSearchConstants.NoXuid;

        /// <summary>
        ///     Gets or sets the Keywords.
        /// </summary>
        public string Keywords { get; set; } = UgcSearchConstants.NoKeywords;

        /// <summary>
        ///     Gets or sets the Car ID.
        /// </summary>
        public int CarId { get; set; } = UgcSearchConstants.NoCarId;

        /// <summary>
        ///     Gets or sets a value indicating whether the search result must be featured.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Performance", "CA1805:Do not initialize unnecessarily", Justification = "Explicitly set")]
        public bool IsFeatured { get; set; } = false;
    }
}
