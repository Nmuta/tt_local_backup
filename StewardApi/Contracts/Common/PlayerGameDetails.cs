using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a player game details.
    /// </summary>
    public sealed class PlayerGameDetails
    {
        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets the last login date in universal time.
        /// </summary>
        public DateTime LastLoginDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the first login date in universal time.
        /// </summary>
        public DateTime FirstLoginDateUtc { get; set; }
    }
}
