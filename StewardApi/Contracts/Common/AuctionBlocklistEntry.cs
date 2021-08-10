using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents an auction house blocklist entry.
    /// </summary>
    public sealed class AuctionBlocklistEntry
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
        public DateTime ExpireDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the description.
        /// </summary>
        public string Description { get; set; }
    }
}
