using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise gift.
    /// </summary>
    public sealed class SunriseGift : Gift
    {
        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public SunriseMasterInventory Inventory { get; set; }
    }
}
