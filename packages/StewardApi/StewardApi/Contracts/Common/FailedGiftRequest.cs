namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a failed request to send an item to a user.
    /// </summary>
    /// <typeparam name="T">The title specific InventoryItemType</typeparam>
    public sealed class FailedGiftRequest<T>
    {
        /// <summary>
        ///     Gets or sets the type.
        /// </summary>
        public T Type { get; set; }

        /// <summary>
        ///     Gets or sets the item.
        /// </summary>
        public MasterInventoryItem Item { get; set; }
    }
}
