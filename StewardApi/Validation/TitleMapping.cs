namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Represents title naming information.
    /// </summary>
    public sealed class TitleMapping
    {
        /// <summary>
        ///     Gets or sets the abbreviation.
        /// </summary>
        public string Abbreviation { get; set; }

        /// <summary>
        ///     Gets or sets the codename.
        /// </summary>
        public string Codename { get; set; }

        /// <summary>
        ///     Gets or sets the retail name.
        /// </summary>
        public string RetailName { get; set; }
    }
}
