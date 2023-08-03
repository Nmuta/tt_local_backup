using System.Collections.Generic;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup
{
    public sealed class RacersCupSchedule
    {
        public List<RacersCupChampionship> Championships { get; set; }
    }
}
