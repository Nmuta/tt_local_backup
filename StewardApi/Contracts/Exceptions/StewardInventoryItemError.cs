using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error with an inventory item.
    /// </summary>`
    public sealed class StewardInventoryItemError : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardInventoryItemError"/> class.
        /// </summary>
        public StewardInventoryItemError()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardInventoryItemError"/> class.
        /// </summary>
        /// <param name="message">The exception message.</param>
        public StewardInventoryItemError(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardInventoryItemError"/> class.
        /// </summary>
        /// <param name="message">The exception message.</param>
        /// <param name="innerException">The inner exception.</param>
        public StewardInventoryItemError(string message, System.Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
