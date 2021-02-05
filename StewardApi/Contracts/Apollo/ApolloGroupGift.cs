using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents a Apollo group gift.
    /// </summary>
    public sealed class ApolloGroupGift
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
        public ApolloMasterInventory Inventory { get; set; }
    }
}
