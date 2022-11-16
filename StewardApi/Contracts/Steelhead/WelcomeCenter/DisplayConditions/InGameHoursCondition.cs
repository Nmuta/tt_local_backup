using System;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.DisplayConditions
{
    /// <summary>
    ///     The tile is eligible for display, if the player's profile fulfills the criteria.
    /// </summary>
    public class InGameHoursCondition : ConditionSettings
    {
        /// <summary>
        ///     Gets or sets the amount of time necesarry to complete the criteria.
        /// </summary>
        public TimeSpan Time { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the player's profile needs to be under or over the value of Time.
        /// </summary>
        public bool LessThanInGameHours { get; set; }
    }
}
