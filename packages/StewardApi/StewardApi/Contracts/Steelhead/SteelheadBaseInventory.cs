using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead base inventory.
    /// </summary>
    /// <typeparam name="TItem">Type of item for use in the inventory.</typeparam>
    /// <typeparam name="TCar">Type of car item for use in the inventory.</typeparam>
    public class SteelheadBaseInventory<TItem, TCar>
        where TItem : MasterInventoryItem
        where TCar : MasterInventoryItem
    {
        /// <summary>
        ///     Gets or sets the credit reward options.
        /// </summary>
        public IList<TItem> CreditRewards { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<TCar> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<TItem> VanityItems { get; set; }
    }
}
