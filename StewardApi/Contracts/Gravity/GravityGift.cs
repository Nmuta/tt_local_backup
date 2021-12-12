using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity gift.
    /// </summary>
    public sealed class GravityGift : Gift
    {
        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public GravityMasterInventory Inventory { get; set; }
    }
}
