using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Represents the Pegasus file path of xmls modified by Steward.
    /// </summary>
    #pragma warning disable SA1600 // Elements should be documented
    public static class PegasusFilePath
    {
        public const string MessageOfTheDay = "/Source/UserMessages/MessageOfTheDay.xml";
        public const string ImageTextTile = "/Source/WorldOfForza/WoFTileImageText.xml";
        public const string GenericPopupTile = "/Source/WorldOfForza/WoFTileGenericPopup.xml";
        public const string DeeplinkTile = "/Source/WorldOfForza/WoFTileDeeplink.xml";
    }
}
