namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise ban result.
    /// </summary>
    public sealed class SunriseBanResult
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
        public SunriseBanDescription BanDescription { get; set; }
    }
}
