using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo player inventory.
    /// </summary>
    public sealed class ApolloPlayerInventory
    {
        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the gift reason.
        /// </summary>
        public string GiftReason { get; set; }

        /// <summary>
        ///     Gets or sets the credits.
        /// </summary>
        public int Credits { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<ApolloCar> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the mods.
        /// </summary>
        public IList<ApolloInventoryItem> Mods { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<ApolloInventoryItem> VanityItems { get; set; }

        /// <summary>
        ///     Gets or sets the packs.
        /// </summary>
        public IList<ApolloInventoryItem> Packs { get; set; }

        /// <summary>
        ///     Gets or sets the badges.
        /// </summary>
        public IList<ApolloInventoryItem> Badges { get; set; }
    }
}
