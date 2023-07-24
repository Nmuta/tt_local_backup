using System;
using System.Collections.Generic;
using WoodstockLiveOpsContent;

#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents an LSP task.
    /// </summary>
    public sealed class LspTask
    {
        public Guid Id { get; set; }

        public string ExecutorType { get; set; }

        public DateTime LastEventUtc { get; set; }

        public string LastException { get; set; }

        public DateTime NextExecutionUtc { get; set; }

        public double PeriodInSeconds { get; set; }

        public LspTaskPeriodType PeriodType { get; set; }

        public double LastRunDuration { get; set; }

        public LspTaskState State { get; set; }

        public Guid Lock { get; set; }

        public DateTime LockTakenUntilUtc { get; set; }

        public string CustomProperties { get; set; }
    }
}
