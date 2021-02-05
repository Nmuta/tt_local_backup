using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise group gift.
    /// </summary>
    public sealed class SunriseGroupGift
    {
        /// <summary>
        ///     Gets or sets the xuid list.
        /// </summary>
        public IList<ulong> Xuids { get; set; }

        /// <summary>
        ///     Gets or sets the gift reason.
        /// </summary>
        public string GiftReason { get; set; }

        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public SunriseMasterInventory Inventory { get; set; }
    }
}
