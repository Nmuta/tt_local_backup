#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a user's configuration for safety rating.
    /// </summary>
    public sealed class SafetyRatingConfig
    {
        public int ProbationRaceCount { get; set; }

        public double MinScore { get; set; }

        public double MaxScore { get; set; }
    }
}
