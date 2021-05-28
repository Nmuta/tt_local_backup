using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error with an inventory item.
    /// </summary>
    public sealed class InventoryItemStewardException : Exception
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="InventoryItemStewardException"/> class.
        /// </summary>
        public InventoryItemStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="InventoryItemStewardException"/> class.
        /// </summary>
        public InventoryItemStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="InventoryItemStewardException"/> class.
        /// </summary>
        public InventoryItemStewardException(string message, System.Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
