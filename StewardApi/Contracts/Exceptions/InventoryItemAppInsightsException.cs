namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error with an inventory item.
    /// </summary>
    public sealed class InventoryItemAppInsightsException : AppInsightsException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="InventoryItemAppInsightsException"/> class.
        /// </summary>
        public InventoryItemAppInsightsException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="InventoryItemAppInsightsException"/> class.
        /// </summary>
        public InventoryItemAppInsightsException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="InventoryItemAppInsightsException"/> class.
        /// </summary>
        public InventoryItemAppInsightsException(string message, System.Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
