using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo group gift.
    /// </summary>
    public sealed class ApolloGroupGift : GroupGift
    {
        /// <summary>
        ///     Gets or sets the gift inventory.
        /// </summary>
        public ApolloMasterInventory Inventory { get; set; }
    }
}
