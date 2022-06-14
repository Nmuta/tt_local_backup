using System;
using Microsoft.AspNetCore.Routing.Constraints;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents game-wide UGC search filters.
    /// </summary>
    public sealed class UGCSearchFilters
    {
        /// <summary>
        ///     Value to pass into carId filter when you want that field to be ignored during the search.
        /// </summary>
        private static int NoCar = -1;

        /// <summary>
        ///     Gets or sets the Keywords.
        /// </summary>
        public string Keywords { get; set; } = string.Empty;

        /// <summary>
        ///     Gets or sets the Car ID.
        /// </summary>
        public int CarId { get; set; } = UGCSearchFilters.NoCar;

        /// <summary>
        ///     Gets or sets a value indicating whether the search result must be featured.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Performance", "CA1805:Do not initialize unnecessarily", Justification = "Explicitly set")]
        public bool IsFeatured { get; set; } = false;
    }
}
