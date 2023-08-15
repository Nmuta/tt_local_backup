using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the possible report weight types.
    /// </summary>
    /// <remarks>Based on ForzaClient ForzaUserReportWeightType.</remarks>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum UserReportWeightType
    {
        Default,
        LockedToAutoFlagReview,
        LockedToZero,
    }
}
