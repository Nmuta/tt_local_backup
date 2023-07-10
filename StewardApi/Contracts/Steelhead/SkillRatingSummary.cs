#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a summary of user's skill rating.
    /// </summary>
    public sealed class SkillRatingSummary
    {
        public double RawMean { get; set; }

        public double NormalizedMean { get; set; }

        public double OverriddenScore { get; set; }

        public bool IsScoreOverridden { get; set; }

        public double NormalizationMin { get; set; }

        public double NormalizationMax { get; set; }
    }
}
