using System;

namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Represents a player inventory item.
    /// </summary>
    public class PlayerInventoryItem : MasterInventoryItem
    {
        /// <summary>
        ///     Gets or sets the date the item was aquired on.
        /// </summary>
        public DateTime? DateAquiredUtc { get; set; }
    }
}
