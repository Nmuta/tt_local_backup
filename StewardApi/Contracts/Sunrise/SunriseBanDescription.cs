using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise ban description.
    /// </summary>
    public sealed class SunriseBanDescription : SunriseBanBase
    {
        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the ban is active.
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        ///     Gets or sets the count of times extended.
        /// </summary>
        public int CountOfTimesExtended { get; set; }

        /// <summary>
        ///     Gets or sets the last extended time.
        /// </summary>
        public DateTime LastExtendedTimeUtc { get; set; }

        /// <summary>
        ///     Gets or sets the last extended reason.
        /// </summary>
        public string LastExtendedReason { get; set; }
    }
}
