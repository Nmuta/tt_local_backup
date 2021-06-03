namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise gift.
    /// </summary>
    public sealed class SunriseGift
    {
        /// <summary>
        ///     Gets or sets the gift reason.
        /// </summary>
        public string GiftReason { get; set; }

        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public SunriseMasterInventory Inventory { get; set; }
    }
}
