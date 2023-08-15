using Turn10.LiveOps.StewardApi.Contracts.Common;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.DisplayConditions
{
    /// <summary>
    ///     Represents a display condition which displays contingent on a date range.
    /// </summary>
    public class DateRangeCondition : ConditionSettings
    {
        public DateTimeOffsetRange Range { get; set; }
    }
}
