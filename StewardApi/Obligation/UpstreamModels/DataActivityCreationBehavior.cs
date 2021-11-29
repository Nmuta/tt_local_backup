using System.Runtime.Serialization;

namespace Turn10.LiveOps.StewardApi.Obligation.UpstreamModels
{
    /// <summary>
    ///     The upstream creation behavior.
    /// </summary>
    public enum DataActivityCreationBehavior
    {
        /// <summary>
        ///     When this dataActivity is created, ensure there is a complete coverage for its timerange in the work table.
        /// </summary>
        /// <remarks>
        ///     This is useful to restatements (which we wan't to happen fully again) or recreations.
        /// </remarks>
        [EnumMember(Value = "full")]
        Full,

        /// <summary>
        ///     When this dataActivity is created, populate slices from approximately now until the end of the dataset.
        /// </summary>
        /// <remarks>
        ///     This is useful for things like a RestateOMatic, which shouldn't need to be historically populated because presumable
        ///     at the creation of that dataActivity you are also creating a non-restatement dataActivity that is fully populated.
        ///
        ///     We say approximately now because this gets both.
        ///     1. Run at various places that aren't in sync with our master of now.
        ///     2. Gets trimmed to an interval.
        /// </remarks>
        [EnumMember(Value = "approximately_now")]
        ApproximatelyNow,

        /// <summary>
        ///     When this dataActivity is created, do not add any slices.
        /// </summary>
        /// <remarks>
        ///     Still remove slices on the occasion that dataActivities are deleted out from under the slice.
        /// </remarks>
        [EnumMember(Value = "none")]
        None
    }
}
