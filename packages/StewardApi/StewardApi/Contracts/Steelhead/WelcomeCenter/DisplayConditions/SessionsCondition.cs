#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.DisplayConditions
{
    /// <summary>
    ///     Represents a display condition which displays contingent on count of player's game sessions.
    /// </summary>
    public class SessionsCondition : ConditionSettings
    {
        // <summary>
        //      Gets or sets the number of sessions to complete the criteria.
        // </summary>
        public uint NumSessions { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the player's profile needs to be under or over the value of Numsessions.
        /// </summary>
        public bool LessThanSessionCount { get; set; }
    }
}
