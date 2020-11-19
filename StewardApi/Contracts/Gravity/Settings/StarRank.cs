using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents the star rank.
    /// </summary>
    public sealed class StarRank
    {
        /// <summary>
        ///     Gets or sets the total mastery threshold.
        /// </summary>
        public int TotalMasteryThreshold { get; set; }

        /// <summary>
        ///     Gets or sets the rank.
        /// </summary>
        public int Rank { get; set; }

        /// <summary>
        ///     Gets or sets the mastery level spacing coefficients.
        /// </summary>
        public IList<double> MasteryLevelSpacingCoefficients { get; set; }

        /// <summary>
        ///     Gets or sets the PI lower threshold proportion.
        /// </summary>
        public double PILowerThresholdProportion { get; set; }

        /// <summary>
        ///     Gets or sets the PI upper threshold proportion.
        /// </summary>
        public double PIUpperThresholdProportion { get; set; }

        /// <summary>
        ///     Gets or sets the max level.
        /// </summary>
        public int MaxLevel { get; set; }

        /// <summary>
        ///     Gets or sets the required upgrades.
        /// </summary>
        public IList<UpgradeRequirement> RequiredUpgrades { get; set; }

        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public Guid Id { get; set; }
    }
}