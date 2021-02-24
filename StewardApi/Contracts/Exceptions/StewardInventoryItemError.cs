using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error with an inventory item.
    /// </summary>`
    public sealed class StewardInventoryItemError
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardInventoryItemError"/> class.
        /// </summary>
        public StewardInventoryItemError()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardInventoryItemError"/> class.
        /// </summary>
        /// <param name="item">The message.</param>
        public StewardInventoryItemError(MasterInventoryItem item)
        {
            item.ShouldNotBeNull(nameof(item));

            this.Item = item;
        }

        /// <summary>
        ///     Gets or sets the item.
        /// </summary>
        public MasterInventoryItem Item { get; set; }
    }
}
