using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead base inventory.
    /// </summary>
    /// <typeparam name="T">Type of item for use in the inventory.</typeparam>
    public class SteelheadBaseInventory<T>
        where T : MasterInventoryItem
    {
        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<T> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<T> VanityItems { get; set; }

        /// <summary>
        ///     Gets or sets the credit reward options.
        /// </summary>
        public IList<T> CreditRewards { get; set; }
    }
}
