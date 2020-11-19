namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise shared console user.
    /// </summary>
    public sealed class SunriseSharedConsoleUser
    {
        /// <summary>
        ///     Gets or sets the shared console ID.
        /// </summary>
        public ulong SharedConsoleId { get; set; }

        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether ever banned.
        /// </summary>
        public bool EverBanned { get; set; }
    }
}
