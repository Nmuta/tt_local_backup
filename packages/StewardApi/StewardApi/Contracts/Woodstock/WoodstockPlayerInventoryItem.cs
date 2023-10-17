using System;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents a Woodstock player inventory item.
    /// </summary>
    public class WoodstockPlayerInventoryItem : PlayerInventoryItem
    {
        /// <summary>
        ///     Gets or sets the item source of the inventory item.
        /// </summary>
        public WoodstockInventoryItemSource InventoryItemSource { get; set; }
    }
}
