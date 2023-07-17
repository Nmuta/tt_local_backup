namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a character customization.
    /// </summary>
    public sealed class CharacterCustomization
    {
        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        ///     Gets or sets the item ID.
        /// </summary>
        public string ItemId { get; set; }

        /// <summary>
        ///     Gets or sets the rarity.
        /// </summary>
        public string Rarity { get; set; }

        /// <summary>
        ///     Gets or sets the item ID.
        /// </summary>
        public string SlotId { get; set; }

        /// <summary>
        ///     Gets or sets the display name.
        /// </summary>
        public string DisplayName { get; set; }
    }
}
