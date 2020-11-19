using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the inventory item.
    /// </summary>
    public class InventoryItem
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
        public DateTime AcquisitionTime { get; set; }

        /// <summary>
        ///     Gets or sets the modified time.
        /// </summary>
        public DateTime ModifiedTime { get; set; }

        /// <summary>
        ///     Gets or sets the last used time.
        /// </summary>
        public DateTime LastUsedTime { get; set; }

        /// <summary>
        ///     Gets or sets the description.
        /// </summary>
        public string Description { get; set; }
    }
}