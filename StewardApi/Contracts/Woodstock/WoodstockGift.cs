using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents a Woodstock gift.
    /// </summary>
    public sealed class WoodstockGift : Gift
    {
        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public WoodstockMasterInventory Inventory { get; set; }
    }
}
