using System.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a master inventory item.
    /// </summary>
    public class MasterInventoryItem
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
        ///     Gets or sets the item error.
        /// </summary>
        public object Error { get; set; }

        /// <summary>
        ///     Parses query results into a master inventory item object.
        /// </summary>
        /// <remarks>
        ///     Doesn't read data by column name because column name varies by inventory item type.
        /// </remarks>
        public static MasterInventoryItem FromQueryResult(IDataReader reader)
        {
            return new MasterInventoryItem
            {
                Id = (int)reader.GetInt64(0),
                Description = reader.GetString(1),
            };
        }
    }
}
