using System.Collections.Generic;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Represents a Welcome Center column of tiles
    /// </summary>
    public class WelcomeCenterTileConfigColumn
    {
        public List<WelcomeCenterTileConfig> TileConfigCollection { get; set; }
    }
}
