using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity gift.
    /// </summary>
    public sealed class GravityGift
    {
        /// <summary>
        ///     Gets or sets the gift reason.
        /// </summary>
        public string GiftReason { get; set; }

        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public GravityMasterInventory Inventory { get; set; }
    }
}
