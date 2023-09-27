namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a failed request to send an item to a user.
    /// </summary>
    /// <typeparam name="TInventoryItemType">The title specific InventoryItemType enum</typeparam>
    public sealed class FailedGiftRequest<TInventoryItemType>
        where TInventoryItemType : System.Enum
    {
        /// <summary>
        ///     Gets or sets the type.
        /// </summary>
        public TInventoryItemType Type { get; set; }

        /// <summary>
        ///     Gets or sets the item.
        /// </summary>
        public MasterInventoryItem Item { get; set; }
    }
}
