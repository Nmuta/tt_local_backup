using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Obligation.UpstreamModels
{
    /// <summary>
    ///     Represents a Kusto data activity.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public sealed class KustoRestateOMaticDataActivity : DataActivityBase
    {
#pragma warning disable CS0414
        /// <summary>
        ///     This property reflects a restatement swap option, and is only applicable to the restatement swap DataActivity.
        ///     The reason this property exists is that our restatement width is usually 20 days. And if you catch a bug
        ///     and ask for a restatement on day 1, you would need to wait 19 more actual days before the fixed up data
        ///     gets swapped in. When a worker sees this flag on a restatement swap DataActivity, it will attempt to orchestrate
        ///     an immediate swap. See the usage in Worker.cs for more details.
        /// </summary>
        [JsonProperty("attempt_mid_partition_sync_swap")]
        private readonly bool attemptMidPartitionSyncSwap;

        /// <summary>
        ///     A restatement of this DataActivity happens in increments of this timespan. Increments of the span start at DataActivity.
        ///
        ///     You can think of this property as virtually dividing the DataActivity timerange into chunks. The concrete
        ///     datasDataActivityet implementors are responsible for picking a scheme to actually divide up the DataActivity into
        ///     these chunks. For example, with drop by tags in Kusto.
        ///
        ///     The two practical effects of this property are that:
        ///     1. When a slice overlaps with a restatement span boundary it will get split such that none of the executions
        ///        cross the boundary.
        ///     2. When a restatement of this DataActivity is performed, it will be expanded to fill these chunks. For example,
        ///        a DataActivity starts at new years 2017, and has a restatment_span of 10 days. A user requests a restatement
        ///        from Jan 9 2017 to jan 11 2017. What they get is a restatement from new years to Jan 20 2017.
        ///
        ///     This value should be chosen large enough that the underlying data is performant, and small enough that doing a
        ///     restatement of a tiny chunk of time doesn't forcibly cause a restatement of some huge chunk of time.
        ///
        ///     This must be a multiple of the execution interval and greater than the minimum execution span. The exception is
        ///     that a TimeSpan.Zero means undefined/null/not applicable. This defaults to 20 days.
        /// </summary>
        [JsonProperty("restatement_span")]
        private readonly TimeSpan restatementSpan;
#pragma warning restore

        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoRestateOMaticDataActivity"/> class.
        /// </summary>
        public KustoRestateOMaticDataActivity()
        {
            this.restatementSpan = TimeSpan.FromDays(20);
            this.attemptMidPartitionSyncSwap = true;
        }

        /// <summary>
        ///     Gets the type discriminator used by the API to decide which object to deserialize and the behavior.
        ///     Do not change this value.
        /// </summary>
        [JsonProperty("type")]
        [JsonConverter(typeof(StringEnumConverter))]
        public override DataActivityType Type { get; } = DataActivityType.RestateOMatic;

        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        /// <remarks>
        ///     The name must be unique per pipeline.
        /// </remarks>
        [JsonProperty("name")]
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to run in off hours only.
        /// </summary>
        /// <remarks>
        ///     This flag can be optionally set to indicate that the DataActivity should only be run on off hours.
        ///     This is intended to be combined with the cluster config to determine what the off hours actually are.
        /// </remarks>
        [JsonProperty("off_hours_only", DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate)]
        public bool OffHoursOnly { get; set; } = false;

        /// <summary>
        ///     Gets or sets the dependencies.
        /// </summary>
        /// <remarks>
        ///     What DataActivities does this depend on (keyed by name, and must be in the same Pipeline).
        /// </remarks>
        [JsonProperty("dependencies")]
        public IList<Dependency> Dependencies { get; set; }

        /// <summary>
        ///     Gets or sets the parallelism limit tags.
        /// </summary>
        [JsonProperty("parallelism_limit_tags")]
        public IList<ParallelismLimit> ParallelismLimitTags { get; set; } = new List<ParallelismLimit>();

        /// <summary>
        ///     Gets or sets the min execution span.
        /// </summary>
        /// <remarks>
        ///     The shortest timespan the system should execute of this activity.
        ///
        ///     Note that this is a suggestion, not a guarantee. Obligation allows some pretty arbitrary manipulation
        ///     of DataActivities, and this is the parameter that gets sacrificed to allow that.
        /// </remarks>
        [JsonProperty("min_execution_span")]
        public TimeSpan MinExecutionSpan { get; set; }

        /// <summary>
        ///     Gets or sets the max execution span.
        /// </summary>
        /// <remarks>
        ///     The longest timespan the system should execute of this activity.
        /// </remarks>
        [JsonProperty("max_execution_span")]
        public TimeSpan MaxExecutionSpan { get; set; }

        /// <summary>
        ///     Gets or sets the execution interval.
        /// </summary>
        /// <remarks>
        ///     Forces all execution to be a multiple of this. Typically, this is left as null (or TimeSpan.Zero). If this
        ///     parameter is used, the minimum execution time is actually enforced, and all other time parameters must be a
        ///     multiple of this. When this is used, it is typically for DataActivities that require hourly or daily execution.
        /// </remarks>
        [JsonProperty("execution_interval")]
        public TimeSpan ExecutionInterval { get; set; }

        /// <summary>
        ///     Gets or sets the delay.
        /// </summary>
        /// <remarks>
        ///     No chunk of time will execute until the end time of that chunk is at least this distant from now. Typically,
        ///     this is set to an hour to allow slow raw events to trickle into the system.
        /// </remarks>
        [JsonProperty("delay")]
        public TimeSpan Delay { get; set; }

        /// <summary>
        ///     Gets or sets the time range.
        /// </summary>
        [JsonProperty("time_range")]
        public TimeRange TimeRange { get; set; }

        /// <summary>
        ///     Gets or sets the num buckets pre-split hint.
        /// </summary>
        /// <remarks>
        ///     Upon creating a slice by splitting on time (ie normal execution) that the slice is also additionally
        ///     split into this many buckets. This is a hint, as it does not always apply, particularly in mid
        ///     partition sync swap scenarios or scale exception splits.
        /// </remarks>
        [JsonProperty("num_buckets_presplit_hint", DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate)]
        public int? NumBucketsPreSplitHint { get; set; }

        /// <summary>
        ///     Gets or sets the Kusto database.
        /// </summary>
        [JsonProperty("kusto_database")]
        public string KustoDatabase { get; set; }

        /// <summary>
        ///     Gets or sets the Kusto query.
        /// </summary>
        /// <remarks>
        ///     The kusto query whose results are to be appended to the given table. Typically this is a
        ///     relatively simply function call with the start and end parameters. For example:
        ///     FactPlayerMatch_Materialize('{StartDate:o}', '{EndDate:o}')
        ///
        ///     StartDate, EndDate, NumBuckets, Bucket and TargetTable are interpolated here (when surrounded by {}) based
        ///     on dataActivity start, end, and kusto table.
        /// </remarks>
        [JsonProperty("kusto_query")]
        public string KustoQuery { get; set; }

        /// <summary>
        ///     Gets or sets the target data activity.
        /// </summary>
        [JsonProperty("target_dataset")]
        public string TargetDataActivity { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to include all the dependent
        ///     dataActivities of the dataActivities given via the dataActivities property.
        /// </summary>
        [JsonProperty("include_children")]
        public bool IncludeChildren { get; set; }
    }
}
