namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents an emote.
    /// </summary>
    public sealed class Emote
    {
        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the animation.
        /// </summary>
        public string Animation { get; set; }

        /// <summary>
        ///     Gets or sets the rarity.
        /// </summary>
        public string Rarity { get; set; }
    }
}
