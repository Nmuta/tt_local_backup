using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents a Woodstock group gift.
    /// </summary>
    public sealed class WoodstockGroupGift : ExpirableGroupGift
    {
        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public WoodstockMasterInventory Inventory { get; set; }
    }
}
