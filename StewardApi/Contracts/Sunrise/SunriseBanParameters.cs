using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise ban parameters.
    /// </summary>
    public sealed class SunriseBanParameters : SunriseBanBase
    {
        /// <summary>
        ///     Gets or sets the xuid list.
        /// </summary>
        public IList<ulong> Xuids { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag list.
        /// </summary>
        public IList<string> Gamertags { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to ban all consoles.
        /// </summary>
        public bool BanAllConsoles { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to ban all PCs.
        /// </summary>
        public bool BanAllPcs { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to delete leaderboard entries.
        /// </summary>
        public bool DeleteLeaderboardEntries { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to send reason notification.
        /// </summary>
        public bool SendReasonNotification { get; set; }
    }
}
