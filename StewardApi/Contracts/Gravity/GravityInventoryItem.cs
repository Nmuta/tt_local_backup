using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity inventory item.
    /// </summary>
    public class GravityInventoryItem : IInventoryItem
    {
        /// <summary>
        ///     Gets or sets the item ID.
        /// </summary>
        public int ItemId { get; set; }

        /// <summary>
        ///     Gets or sets the quantity.
        /// </summary>
        public long Quantity { get; set; }

        /// <summary>
        ///     Gets or sets the acquisition time.
        /// </summary>
        public DateTime AcquisitionUtc { get; set; }

        /// <summary>
        ///     Gets or sets the modified time.
        /// </summary>
        public DateTime ModifiedUtc { get; set; }

        /// <summary>
        ///     Gets or sets the last used time.
        /// </summary>
        public DateTime LastUsedUtc { get; set; }

        /// <summary>
        ///     Gets or sets the description.
        /// </summary>
        public string Description { get; set; }
    }
}
