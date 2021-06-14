using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a ban result.
    /// </summary>
    public sealed class BanResult
    {
        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the ban description.
        /// </summary>
        public BanDescription BanDescription { get; set; }

        /// <summary>
        ///     Gets or sets the banning error.
        /// </summary>
        public StewardError Error { get; set; }
    }
}
