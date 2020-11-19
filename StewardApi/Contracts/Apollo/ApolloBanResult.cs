namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo ban result.
    /// </summary>
    public sealed class ApolloBanResult
    {
        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the ban was successful.
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        ///     Gets or sets the ban description.
        /// </summary>
        public ApolloBanDescription BanDescription { get; set; }
    }
}
