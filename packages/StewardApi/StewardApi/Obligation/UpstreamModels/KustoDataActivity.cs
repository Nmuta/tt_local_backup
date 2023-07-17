using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Obligation.UpstreamModels
{
    /// <summary>
    ///     Represents a Kusto data activity.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public sealed class KustoDataActivity : DataActivityBase
    {
#pragma warning disable CS0414
        /// <remarks>
        ///     Not sure what this is for but it's on the model that this code is c/p from.
        /// </remarks>
        [JsonProperty("attempt_mid_partition_sync_swap")]
        private bool attemptMidPartitionSyncSwap;

        /// <remarks>
        ///     Not sure what this is for but it's on the model that this code is c/p from.
        /// </remarks>
        [JsonProperty("restatement_span")]
        private TimeSpan restatementSpan;

        [JsonProperty("is_time_agnostic")]
        private bool isTimeAgnostic;

        [JsonIgnore]
        private TimeSpan maxExecutionSpan;
#pragma warning restore

        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoDataActivity"/> class.
        /// </summary>
        public KustoDataActivity()
        {
            this.restatementSpan = TimeSpan.FromDays(20);
            this.attemptMidPartitionSyncSwap = true;
        }

        /// <summary>
        ///     Gets or sets a value indicating whether this data activity...
        ///       1. Does not use Time Parameters
        ///       2. Targets a single partition.
        /// </summary>
        public bool IsTimeAgnostic
        {
            get => this.isTimeAgnostic;

            set
            {
                this.isTimeAgnostic = value;
                if (this.isTimeAgnostic)
                {
                    this.restatementSpan = TimeSpan.Zero;
                    this.attemptMidPartitionSyncSwap = false;
                    this.MaxExecutionSpan = (this.TimeRange.End - this.TimeRange.Start).Add(TimeSpan.FromMinutes(5));
                }
            }
        }

        /// <summary>
        ///     Gets the type discriminator used by the API to decide which object to deserialize and the behavior.
        /// </summary>
        /// <remarks>
        ///     Do not change this value.
        /// </remarks>
        [JsonProperty("type")]
        [JsonConverter(typeof(StringEnumConverter))]
        public override DataActivityType Type { get; } = DataActivityType.Kusto;

        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        /// <remarks>
        ///     The name must be unique per pipeline.
        /// </remarks>
        [JsonProperty("name")]
        public string Name { get; set; }

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
        public TimeSpan MaxExecutionSpan
        {
            get
            {
                if (this.IsTimeAgnostic)
                {
                    var minimumTimeSpan = (this.TimeRange.End - this.TimeRange.Start).Add(TimeSpan.FromMinutes(5));
                    var intervals = Math.Ceiling(minimumTimeSpan / this.ExecutionInterval);
                    return intervals * this.ExecutionInterval;
                }

                return this.maxExecutionSpan;
            }

            set => this.maxExecutionSpan = value;
        }

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
        ///     Gets or sets a value indicating whether to run in off hours only.
        /// </summary>
        /// <remarks>
        ///     This flag can be optionally set to indicate that the DataActivity should only be run on off hours.
        ///     This is intended to be combined with the cluster config to determine what the off hours actually are.
        /// </remarks>
        [JsonProperty("off_hours_only", DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate)]
        public bool OffHoursOnly { get; set; } = false;

        /// <summary>
        ///     Gets or sets the Kusto database.
        /// </summary>
        [JsonProperty("kusto_database")]
        public string KustoDatabase { get; set; }

        /// <summary>
        ///     Gets or sets the Kusto table.
        /// </summary>
        [JsonProperty("kusto_table")]
        public string KustoTable { get; set; }

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
        ///     Gets or sets the initialization query.
        /// </summary>
        /// <remarks>
        ///     Runs once when the dataActivity is created. An opportunity for initialization queries/commands.
        ///     Typically this might be to create the dataActivity table, like this:
        ///     .set-or-append FactPlayerMatch_Materialized &lt;| FactPlayerMatch_Calculate(now(), now())
        ///
        ///     StartDate, EndDate, NumBuckets, Bucket, and TargetTable are interpolated here (when surrounded by {}) based
        ///     on dataActivity start, end, and kusto table.
        /// </remarks>
        [JsonProperty("initialization_query")]
        public string InitializationQuery { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to refuse to alter.
        /// </summary>
        /// <remarks>
        ///     Gives DataActivities the ability to opt out of the automatic table alterations.
        /// </remarks>
        [JsonProperty("refuse_to_alter", DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate)]
        public bool RefuseToAlter { get; set; }

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
    }
}
