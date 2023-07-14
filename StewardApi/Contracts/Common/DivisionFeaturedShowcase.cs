using System;
using System.Collections.Generic;
using WoodstockLiveOpsContent;

#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a featured showcase of a division.
    /// </summary>
    public sealed class DivisionFeaturedShowcase
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public DateTimeOffset? StartTimeUtc { get; set; }

        public DateTimeOffset? EndTimeUtc { get; set; }

        public int DivisionId { get; set; }

        public string DivisionName { get; set; }
    }
}
