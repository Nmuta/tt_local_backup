using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Provides common Kusto data activity usages.
    /// </summary>
    public static class KustoDataActivityExtensions
    {
        /// <summary>
        ///     Adds a parallelism limit.
        /// </summary>
        /// <param name="activity">The activity.</param>
        /// <param name="count">The count.</param>
        /// <param name="tenant">The tenant.</param>
        /// <param name="pipelineName">The pipeline name.</param>
        /// <returns>The <see cref="KustoDataActivity"/>.</returns>
        public static KustoDataActivity AddParallelismLimit(this KustoDataActivity activity, int count, string tenant, string pipelineName)
        {
            activity.ShouldNotBeNull(nameof(activity));
            tenant.ShouldNotBeNullEmptyOrWhiteSpace(nameof(tenant));
            pipelineName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(pipelineName));

            activity.ParallelismLimitTags.Add(new ParallelismLimit
            {
                Tag = $"{tenant}.{pipelineName}.{activity.Name}",
                Limit = count
            });

            return activity;
        }
    }
}
