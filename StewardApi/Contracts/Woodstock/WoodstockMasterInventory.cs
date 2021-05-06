using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents a Woodstock master inventory.
    /// </summary>
    public sealed class WoodstockMasterInventory
    {
        /// <summary>
        ///     Gets or sets the credit reward options.
        /// </summary>
        public IList<MasterInventoryItem> CreditRewards { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<MasterInventoryItem> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the car horns.
        /// </summary>
        public IList<MasterInventoryItem> CarHorns { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<MasterInventoryItem> VanityItems { get; set; }

        /// <summary>
        ///     Gets or sets the emotes.
        /// </summary>
        public IList<MasterInventoryItem> Emotes { get; set; }

        /// <summary>
        ///     Gets or sets the quick chat lines.
        /// </summary>
        public IList<MasterInventoryItem> QuickChatLines { get; set; }
    }
}
