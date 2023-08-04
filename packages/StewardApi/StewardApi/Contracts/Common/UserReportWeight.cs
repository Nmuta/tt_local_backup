#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
#pragma warning disable SA1300 // Element should begin with upper-case letter
#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a user report weight.
    /// </summary>
    public class UserReportWeight
    {
        public int Weight { get; set; }

        public UserReportWeightType Type { get; set; }
    }
}
