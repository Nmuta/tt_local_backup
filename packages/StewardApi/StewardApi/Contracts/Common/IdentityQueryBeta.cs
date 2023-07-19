namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents an identity query.
    /// </summary>
    public sealed class IdentityQueryBeta
    {
        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets the Turn 10 ID.
        /// </summary>
        public string T10Id { get; set; }

        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong? Xuid { get; set; }
    }
}
