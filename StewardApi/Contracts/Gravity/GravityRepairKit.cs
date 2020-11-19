namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents information related to a Gravity repair kit.
    /// </summary>
    public sealed class GravityRepairKit : GravityInventoryItem
    {
        /// <summary>
        ///     Gets or sets the partial quantity.
        /// </summary>
        public float PartialQuantity { get; set; }
    }
}
