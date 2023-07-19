using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo gift.
    /// </summary>
    public sealed class ApolloGift : Gift
    {
        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public ApolloMasterInventory Inventory { get; set; }
    }
}
