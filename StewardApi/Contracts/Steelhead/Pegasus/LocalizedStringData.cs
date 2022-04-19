namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.Pegasus
{
    /// <summary>
    ///     Represents Pegasus localized string data.
    /// </summary>
    public sealed class LocalizedStringData
    {
        /// <summary>
        ///     Gets or sets the string to localize.
        /// </summary>
        public string StringToLocalize { get; set; }

        /// <summary>
        ///     Gets or sets the description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        ///     Gets or sets the category.
        /// </summary>
        /// <remarks><see cref="LocalizationCategory" />.</remarks>
        public string Category { get; set; }

        /// <summary>
        ///     Gets or sets the max length.
        /// </summary>
        public int MaxLength { get; set; }
    }
}
