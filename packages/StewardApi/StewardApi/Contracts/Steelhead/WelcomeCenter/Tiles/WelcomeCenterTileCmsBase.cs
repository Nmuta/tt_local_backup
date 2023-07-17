#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

using Turn10;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles
{
    /// <summary>
    ///     Represents base values for Welcome Center tile.
    /// </summary>
    public class WelcomeCenterTileCmsBase
    {
        public string FriendlyName { get; set; }

        public string CMSTileID { get; set; }

        public string TileTitle { get; set; }

        public string TileType { get; set; }

        public string TileDescription { get; set; }

        public string TileImagePath { get; set; }

        public string TelemetryTag { get; set; }

        public string Type { get; set; }
    }
}
