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

        /// <summary>
        ///     Adds a parallelism limit.
        /// </summary>
        public static KustoRestateOMaticDataActivity AddParallelismLimit(
            this KustoRestateOMaticDataActivity activity, int count, string tenant, string pipelineName)
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
