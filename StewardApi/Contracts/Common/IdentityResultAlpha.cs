using Turn10.LiveOps.StewardApi.Contracts.Errors;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents results of an identity query.
    /// </summary>
    public sealed class IdentityResultAlpha
    {
        /// <summary>
        ///     Gets or sets the query.
        /// </summary>
        public IdentityQueryAlpha Query { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the error.
        /// </summary>
        public StewardError Error { get; set; }
    }
}
