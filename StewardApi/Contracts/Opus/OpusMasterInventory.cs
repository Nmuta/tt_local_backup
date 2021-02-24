using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Opus
{
    /// <summary>
    ///     Represents an Opus master inventory.
    /// </summary>
    public sealed class OpusMasterInventory
    {
        /// <summary>
        ///     Gets or sets the credit reward options.
        /// </summary>
        public IList<MasterInventoryItem> CreditRewards { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<MasterInventoryItem> Cars { get; set; }
    }
}
