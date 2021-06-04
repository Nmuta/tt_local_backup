using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a profile summary.
    /// </summary>
    public sealed class ProfileSummary
    {
        /// <summary>
        ///     Gets or sets the total Tombola spins.
        /// </summary>
        public int TotalTombolaSpins { get; set; }

        /// <summary>
        ///     Gets or sets the total Super Tombola spins.
        /// </summary>
        public int TotalSuperTombolaSpins { get; set; }

        /// <summary>
        ///     Gets or sets the current credits.
        /// </summary>
        public int CurrentCredits { get; set; }

        /// <summary>
        ///     Gets or sets the max credits.
        /// </summary>
        public int MaxCredits { get; set; }

        /// <summary>
        ///     Gets or sets houses purchased count.
        /// </summary>
        public int HousesPurchased { get; set; }

        /// <summary>
        ///     Gets or sets the unaccounted for credits.
        /// </summary>
        public long UnaccountedForCredits { get; set; }

        /// <summary>
        ///     Gets or sets the total XP.
        /// </summary>
        public long TotalXp { get; set; }

        /// <summary>
        ///     Gets or sets the hack flags.
        /// </summary>
        public IList<string> HackFlags { get; set; }
    }
}
