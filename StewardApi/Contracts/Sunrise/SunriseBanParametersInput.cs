using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Turn10.LiveOps.StewardApi.Helpers.JsonConverters;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Sunrise ban parameters as sent to the API.
    /// </summary>
    public sealed class SunriseBanParametersInput
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
        public DateTime? StartTimeUtc { get; set; }

        /// <summary>
        ///     Gets or sets the duration.
        /// </summary>
        public TimeSpan? Duration { get; set; }

        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong? Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to ban all consoles.
        /// </summary>
        public bool? BanAllConsoles { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to ban all PCs.
        /// </summary>
        public bool? BanAllPcs { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to delete leaderboard entries.
        /// </summary>
        public bool? DeleteLeaderboardEntries { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to send reason notification.
        /// </summary>
        public bool? SendReasonNotification { get; set; }
    }
}
