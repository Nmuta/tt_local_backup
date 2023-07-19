using System.Collections.Generic;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup
{
    public sealed class RacersCupEvent
    {
        public string Name { get; set; }

        public string PlaylistName { get; set; }

        public string CarRestrictions { get; set; }

        public List<RacersCupEventWindow> EventWindows { get; set; }

        public List<RacersCupGameOptions> GameOptions { get; set; }

        public int OpenPracticeInMinutes { get; set; }

        public RacersCupQualificationOptions QualificationOptions { get; set; }
    }
}
