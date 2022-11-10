using System.Collections.Generic;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Output
{
    /// <summary>
    ///     Represents the Welcome Center, including it's three columns of tiles.
    /// </summary>
    public class WelcomeCenterOutput
    {
        public List<WelcomeCenterTileOutput> Left { get; set; }

        public List<WelcomeCenterTileOutput> Center { get; set; }

        public List<WelcomeCenterTileOutput> Right { get; set; }
    }
}
