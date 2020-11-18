using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents game settings.
    /// </summary>
    public sealed class GameSettings
    {
        /// <summary>
        ///     Gets or sets the currencies.
        /// </summary>
        public IList<GameDataItem<int>> Currencies { get; set; }

        /// <summary>
        ///     Gets or sets the repair kits.
        /// </summary>
        public IList<GameDataItem<RepairKitDetails>> RepairKits { get; set; }

        /// <summary>
        ///     Gets or sets the mastery kits.
        /// </summary>
        public IList<GameDataItem<MasteryKitDetails>> MasteryKits { get; set; }

        /// <summary>
        ///     Gets or sets the upgrade kits.
        /// </summary>
        public IList<GameDataItem<UpgradeKitDetails>> UpgradeKits { get; set; }

        /// <summary>
        ///     Gets or sets the pack definitions.
        /// </summary>
        public IList<GameDataItem<int>> PackDefinitions { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<GameDataItem<CarDetails>> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the energy refills.
        /// </summary>
        public IList<GameDataItem<EnergyRefillDetails>> EnergyRefills { get; set; }

        /// <summary>
        ///     Gets or sets the heat details.
        /// </summary>
        public IList<GameDataItem<HeatDetails>> HeatDetails { get; set; }

        /// <summary>
        ///     Gets or sets the FTUE states.
        /// </summary>
        public IList<string> FtueStates { get; set; }

        /// <summary>
        ///     Gets or sets the car classes.
        /// </summary>
        public IList<string> CarClasses { get; set; }

        /// <summary>
        ///     Gets or sets the car eras.
        /// </summary>
        public IList<string> CarEras { get; set; }

        /// <summary>
        ///     Gets or sets the car grades.
        /// </summary>
        public IList<string> CarGrades { get; set; }

        /// <summary>
        ///     Gets or sets the career node types.
        /// </summary>
        public IList<string> CareerNodeTypes { get; set; }

        /// <summary>
        ///     Gets or sets the heat event types.
        /// </summary>
        public IList<string> HeatEventTypes { get; set; }

        /// <summary>
        ///     Gets or sets the career reward types.
        /// </summary>
        public IList<string> CareerRewardTypes { get; set; }

        /// <summary>
        ///     Gets or sets the subscription tiers.
        /// </summary>
        public IList<string> SubscriptionTiers { get; set; }

        /// <summary>
        ///     Gets or sets the upgrade requirement item types.
        /// </summary>
        public IList<string> UpgradeRequirementItemTypes { get; set; }

        /// <summary>
        ///     Gets or sets the upgrade tiers.
        /// </summary>
        public IList<string> UpgradeTiers { get; set; }
    }
}
