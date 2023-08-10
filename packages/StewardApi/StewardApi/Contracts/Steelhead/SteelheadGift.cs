using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead gift.
    /// </summary>
    public sealed class SteelheadGift : LocalizedMessageExpirableGift
    {
        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public SteelheadMasterInventory Inventory { get; set; }
    }
}
