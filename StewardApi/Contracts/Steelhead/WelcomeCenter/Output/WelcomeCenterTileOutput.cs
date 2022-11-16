using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Output
{
    /// <summary>
    ///     Represents Welcome Center tile values used by UI
    /// </summary>
    public class WelcomeCenterTileOutput
    {
        public string TileTypeV3 { get; set; }

        public short Priority { get; set; }

        public TileSize Size { get; set; }

        //Don't use JObject, this should by all rights be using ConditionSettings, but was blocking on deserializing abstract class
        public List<JObject> DisplayConditionDataList { get; set; }

        public string TileFriendlyName { get; set; }

        public string TileTitle { get; set; }

        public string TileType { get; set; }

        public string TileDescription { get; set; }

        public string TileImagePath { get; set; }

        public string TileTelemetryTag { get; set; }
    }
}
