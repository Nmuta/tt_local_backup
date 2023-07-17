namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a car horn.
    /// </summary>
    public sealed class CarHorn
    {
        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        ///     Gets or sets the category.
        /// </summary>
        public long Category { get; set; }

        /// <summary>
        ///     Gets or sets the display name.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        ///     Gets or sets the rarity.
        /// </summary>
        public string Rarity { get; set; }
    }
}
