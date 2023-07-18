using System;
using System.Collections.Generic;
using WoodstockLiveOpsContent;

#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Rivals event.
    /// </summary>
    public sealed class RivalsEvent
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public int TrackId { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string ScoreType { get; set; }

        public string TrackName { get; set; }

        public IEnumerable<string> CarRestrictions { get; set; }
    }
}
