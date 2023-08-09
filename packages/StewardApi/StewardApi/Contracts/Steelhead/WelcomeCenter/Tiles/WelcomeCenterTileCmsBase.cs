#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

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
