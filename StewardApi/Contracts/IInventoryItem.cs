using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Shared specification for all inventory items.
    /// </summary>
    public interface IInventoryItem
    {
        /// <summary>
        ///     Gets the item ID.
        /// </summary>
        public int ItemId { get; }

        /// <summary>
        ///     Gets the quantity.
        /// </summary>
        public long Quantity { get; }

        /// <summary>
        ///     Gets the acquisition time.
        /// </summary>
        public DateTime AcquisitionUtc { get; }

        /// <summary>
        ///     Gets the last used time.
        /// </summary>
        public DateTime LastUsedUtc { get; }

        /// <summary>
        ///     Gets the description.
        /// </summary>
        public string Description { get; }
    }
}
