using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Validated Apollo ban parameters, as stored internally.
    /// </summary>
    public sealed class ApolloBanParameters
    {
        /// <summary>
        ///     Gets or sets the reason.
        /// </summary>
        public string Reason { get; set; }

        /// <summary>
        ///     Gets or sets the feature area.
        /// </summary>
        public string FeatureArea { get; set; }

        /// <summary>
        ///     Gets or sets the start time.
        /// </summary>
        public DateTime StartTimeUtc { get; set; }

        /// <summary>
        ///     Gets or sets the expiry time.
        /// </summary>
        public DateTime ExpireTimeUtc { get; set; }

        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to ban all consoles.
        /// </summary>
        public bool BanAllConsoles { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to ban all PCs.
        /// </summary>
        public bool BanAllPcs { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to delete leader board entries.
        /// </summary>
        public bool DeleteLeaderboardEntries { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to send reason notification.
        /// </summary>
        public bool SendReasonNotification { get; set; }
    }
}