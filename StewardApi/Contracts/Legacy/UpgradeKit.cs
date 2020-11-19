namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the upgrade kit.
    /// </summary>
    public sealed class UpgradeKit : InventoryItem
    {
        /// <summary>
        ///     Gets or sets the partial quantity.
        /// </summary>
        public float PartialQuantity { get; set; }
    }
}