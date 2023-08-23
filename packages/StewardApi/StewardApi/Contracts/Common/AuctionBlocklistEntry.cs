using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents an auction house block list entry.
    /// </summary>
    public sealed class AuctionBlockListEntry
    {
        /// <summary>
        ///     Gets or sets the car ID.
        /// </summary>
        public int CarId { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the entry expires.
        /// </summary>
        public bool DoesExpire { get; set; }

        /// <summary>
        ///     Gets or sets the expire date.
        /// </summary>
        public DateTime? ExpireDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        ///     Gets or sets the release series.
        /// </summary>
        public int Series { get; set; }
    }
}
