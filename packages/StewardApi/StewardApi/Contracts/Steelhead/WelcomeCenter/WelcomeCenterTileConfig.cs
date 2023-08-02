using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Represents a Welcome Center tile configuration.
    /// </summary>
    public class WelcomeCenterTileConfig
    {
        public string TileTypeV3 { get; set; }

        public short Priority { get; set; }

        public TileSize Size { get; set; }

        //Don't use JObject, this should by all rights be using ConditionSettings, but was blocking on deserializing abstract class
        public List<JObject> DisplayConditionDataList { get; set; }

        public string CMSTileDataID { get; set; }

        public string Type { get; set; }
    }
}
