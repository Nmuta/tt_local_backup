namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents information related to a Gravity upgrade kit.
    /// </summary>
    public sealed class GravityUpgradeKit : GravityInventoryItem
    {
        /// <summary>
        ///     Gets or sets the partial quantity.
        /// </summary>
        public float PartialQuantity { get; set; }
    }
}
