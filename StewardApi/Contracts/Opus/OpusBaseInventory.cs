using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Opus
{
    /// <summary>
    ///     Represents an Opus base inventory.
    /// </summary>
    public class OpusBaseInventory<T>
        where T : MasterInventoryItem
    {
        /// <summary>
        ///     Gets or sets the credit reward options.
        /// </summary>
        public IList<T> CreditRewards { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<T> Cars { get; set; }
    }
}
