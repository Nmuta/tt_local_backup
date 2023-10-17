using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead player inventory item.
    /// </summary>
    public class SteelheadPlayerInventoryItem : PlayerInventoryItem
    {
        /// <summary>
        ///     Gets or sets the item source of the inventory item.
        /// </summary>
        public SteelheadInventoryItemSource InventoryItemSource { get; set; }
    }
}
