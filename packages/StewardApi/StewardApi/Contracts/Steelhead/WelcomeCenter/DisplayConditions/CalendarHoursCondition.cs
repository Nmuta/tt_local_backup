using System;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.DisplayConditions
{
    /// <summary>
    ///     Represents a display condition which displays contingent on calendar hours.
    /// </summary>
    public class CalendarHoursCondition : ConditionSettings
    {
        public TimeSpan Time { get; set; }
    }
}
