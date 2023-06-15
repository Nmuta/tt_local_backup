#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents an update to apply to a user's safety rating.
    /// </summary>
    public sealed class SafetyRatingInput
    {
        public double Score { get; set; }

        public bool IsInProbationaryPeriod { get; set; }
    }
}
