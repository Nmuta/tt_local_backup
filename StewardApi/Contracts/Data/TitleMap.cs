namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Maps various title strings.
    /// </summary>
    public sealed class TitleMap
    {
        /// <summary>
        ///     Gets or sets the title ID.
        /// </summary>
        public string TitleId { get; set; }

        /// <summary>
        ///     Gets or sets the name internal.
        /// </summary>
        public string NameInternal { get; set; }

        /// <summary>
        ///     Gets or sets the name external.
        /// </summary>
        public string NameExternal { get; set; }

        /// <summary>
        ///     Gets or sets the name external full.
        /// </summary>
        public string NameExternalFull { get; set; }
    }
}
