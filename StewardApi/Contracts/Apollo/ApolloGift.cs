namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents a Apollo gift.
    /// </summary>
    public sealed class ApolloGift
    {
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
