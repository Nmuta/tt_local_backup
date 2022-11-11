using System.Collections.Generic;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    public class WelcomeCenter
    {
        public List<WelcomeCenterTileConfigColumn> TileColumnCollection { get; set; }
    }
}
