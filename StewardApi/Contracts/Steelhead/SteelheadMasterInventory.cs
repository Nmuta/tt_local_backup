using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead master inventory.
    /// </summary>
    public sealed class SteelheadMasterInventory
    {
        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<MasterInventoryItem> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<MasterInventoryItem> VanityItems { get; set; }

        /// <summary>
        ///     Gets or sets the credit reward options.
        /// </summary>
        public IList<MasterInventoryItem> CreditRewards { get; set; }
    }
}
