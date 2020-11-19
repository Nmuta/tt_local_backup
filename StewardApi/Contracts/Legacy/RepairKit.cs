namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the repair kit.
    /// </summary>
    public sealed class RepairKit : InventoryItem
    {
        /// <summary>
        ///     Gets or sets the partial quantity.
        /// </summary>
        public float PartialQuantity { get; set; }
    }
}