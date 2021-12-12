using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise group gift.
    /// </summary>
    public sealed class SunriseGroupGift : GroupGift
    {
        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public SunriseMasterInventory Inventory { get; set; }
    }
}
