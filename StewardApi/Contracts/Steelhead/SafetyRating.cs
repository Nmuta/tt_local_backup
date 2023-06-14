#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a users rating in safe driving.
    /// </summary>
    public sealed class SafetyRating
    {
        public SafetyRatingGrade Grade { get; set; }

        public double Score { get; set; }

        public bool IsInProbationaryPeriod { get; set; }

        public double ProbationaryScoreEstimate { get; set; }
    }
}
