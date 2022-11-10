using System.Collections.Generic;
using Turn10;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles;

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
