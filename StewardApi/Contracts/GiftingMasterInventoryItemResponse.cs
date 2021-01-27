namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Represents an identity query.
    /// </summary>
    public sealed class GiftingMasterInventoryItemResponse
    {
        /// <summary>
        ///     Gets or sets the item ID.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        ///     Gets or sets the item description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        ///     Gets or sets the item quantity.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        ///     Gets or sets the response error.
        /// </summary>
        public object Error { get; set; }
    }
}
