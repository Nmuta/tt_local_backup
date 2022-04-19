namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.Pegasus
{
    /// <summary>
    ///     Represents the results of localization requests.
    /// </summary>
    public sealed class LocalizationStringResult
    {
        /// <summary>
        ///     Gets or sets the max length.
        /// </summary>
        public int MaxLength { get; set; }

        /// <summary>
        ///     Gets or sets the category.
        /// </summary>
        /// <remarks><see cref="LocalizationCategory" />.</remarks>
        public LocalizationCategory Category { get; set; }

        /// <summary>
        ///     Gets or sets the Localized String.
        /// </summary>
        public string LocalizedString { get; set; }
    }
}
