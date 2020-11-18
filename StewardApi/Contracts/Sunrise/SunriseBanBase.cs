using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Base type for Sunrise ban information.
    /// </summary>
    public abstract class SunriseBanBase
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
        ///     Gets or sets the expire time.
        /// </summary>
        public DateTime ExpireTimeUtc { get; set; }
    }
}
