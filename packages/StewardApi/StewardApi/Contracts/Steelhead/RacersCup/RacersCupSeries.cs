using System;
using System.Collections.Generic;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup
{
    public sealed class RacersCupSeries
    {
        public string Name { get; set; }

        public List<RacersCupEvent> Events { get; set; }

        public DateTime? CloseTimeUtc { get; set; }

        public DateTime? OpenTimeUtc { get; set; }

        public TimeSpan EventPlaylistTransitionTimeUtc { get; set; }
    }
}
