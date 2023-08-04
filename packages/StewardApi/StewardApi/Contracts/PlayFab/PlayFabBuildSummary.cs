using PlayFab.MultiplayerModels;
using System;
using System.Collections.Generic;

#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.PlayFab
{
    public class PlayFabBuildSummary
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public DateTime? CreationDateUtc { get; set; }

        public Dictionary<string, string> Metadata { get; set; }

        public IList<BuildRegion> RegionConfigurations { get; set; }
    }
}
