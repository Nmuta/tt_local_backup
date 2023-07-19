namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents the Forza car.
    /// </summary>
    public sealed class ForzaCar
    {
        /// <summary>
        ///     Gets or sets the car ID.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        ///     Gets or sets the car name.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        ///     Gets or sets the media name.
        /// </summary>
        public string MediaName { get; set; }

        /// <summary>
        ///     Gets or sets the model short.
        /// </summary>
        public string ModelShort { get; set; }

        /// <summary>
        ///     Gets or sets the make display name.
        /// </summary>
        public string MakeDisplayName { get; set; }
    }
}
