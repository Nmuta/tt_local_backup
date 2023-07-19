using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead group gift.
    /// </summary>
    public class SteelheadGroupGift : LocalizedMessageExpirableGroupGift
    {
        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public SteelheadMasterInventory Inventory { get; set; }
    }
}
