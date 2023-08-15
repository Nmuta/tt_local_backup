using System.Collections.Generic;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles
{
    /// <summary>
    ///     Represents a collection of Welcome Center tiles.
    /// </summary>
    public class WelcomeCenterTiles
    {
        public List<WelcomeCenterTileCmsBase> TileCMSCollection { get; set; }
    }
}
