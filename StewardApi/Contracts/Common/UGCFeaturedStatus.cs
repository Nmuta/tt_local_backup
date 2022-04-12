using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Defines a UGC item's featured status.
    /// </summary>
    public sealed class UgcFeaturedStatus
    {
        /// <summary>
        ///     Gets or sets a value indicating whether the item is featured.
        /// </summary>
        public bool IsFeatured { get; set; }

        /// <summary>
        ///     Gets or sets the featured expiry time.
        /// </summary>
        public TimeSpan? Expiry { get; set; }
    }
}
