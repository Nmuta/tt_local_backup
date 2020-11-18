using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo group gift.
    /// </summary>
    public sealed class ApolloGroupGift
    {
        /// <summary>
        ///     Gets or sets the gamertag list.
        /// </summary>
        public IList<string> Gamertags { get; set; }

        /// <summary>
        ///     Gets or sets the xuid list.
        /// </summary>
        public IList<ulong> Xuids { get; set; }

        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public ApolloPlayerInventory GiftInventory { get; set; }
    }
}