using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Represents a restate-o-matic obligation data activity.
    /// </summary>
    public sealed class ObligationKustoRestateOMaticDataActivity
    {
        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string ActivityName { get; set; }

        /// <summary>
        ///     Gets or sets the Kusto function name and options.
        /// </summary>
        public KustoFunction KustoFunction { get; set; }

        /// <summary>
        ///     Gets or sets the destination database.
        /// </summary>
        public string DestinationDatabase { get; set; }

        /// <summary>
        ///     Gets or sets the start date.
        /// </summary>
        public DateTime StartDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the end date.
        /// </summary>
        public DateTime EndDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the maximum slice interval that can used.
        /// </summary>
        /// <remarks>
        ///     This is useful when restating data to allow Obligation to grab larger than normal slices
        ///     which will reduce the amount of time required to restate the data.
        /// </remarks>
        public TimeSpan MaxExecutionSpan { get; set; }

        /// <summary>
        ///     Gets or sets the execution interval.
        /// </summary>
        /// <remarks>
        ///     This is how often the activity should be run. As an example, an activity that is meant to
        ///     output something at a daily grain should have this set to 1 day.
        /// </remarks>
        public TimeSpan ExecutionInterval { get; set; }

        /// <summary>
        ///     Gets or sets the processing delay.
        /// </summary>
        /// <remarks>
        ///     This value will control how delayed the data is. If there is an expectation that data may be
        ///     delayed at the source, this value should be used to ensure that the activity doesn't execute
        ///     until that expected time has elapsed.
        /// </remarks>
        public TimeSpan ExecutionDelay { get; set; }

        /// <summary>
        ///     Gets or sets the data activity dependency names.
        /// </summary>
        /// <remarks>
        ///     This should be a list of pipeline names that are known by Obligation. Adding an activity that is
        ///     not created as part of the request or does not exist will cause the request to fail.
        /// </remarks>
        public IList<string> DataActivityDependencyNames { get; set; }

        /// <summary>
        ///     Gets or sets the parallelism limit.
        /// </summary>
        public int ParallelismLimit { get; set; }

        /// <summary>
        ///     Gets or sets the Kusto database.
        /// </summary>
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
        public string KustoQuery { get; set; }

        /// <summary>
        ///     Gets or sets the target data activity.
        /// </summary>
        public string TargetDataActivity { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to include all the dependent
        ///     dataActivities of the dataActivities given via the dataActivities property.
        /// </summary>
        public bool IncludeChildren { get; set; }
    }
}
