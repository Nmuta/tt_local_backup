using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a player inventory item.
    /// </summary>
    public class PlayerInventoryItem : MasterInventoryItem
    {
        /// <summary>
        ///     Gets or sets the date the item was acquired on.
        /// </summary>
        public DateTime? DateAquiredUtc { get; set; }
    }
}
