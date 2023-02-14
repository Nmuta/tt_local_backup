using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    /// <summary>
    ///     World of Forza Image Text Tile Bridge.
    /// </summary>
    public class WofImageTextBridge
    {
        /// <summary>
        ///     Gets or sets the friendly name.
        /// </summary>
        public string FriendlyName { get; set; }

        /// <summary>
        ///     Gets or sets the tile size.
        /// </summary>
        public TileSize Size { get; set; }

        /// <summary>
        ///     Gets or sets the tile tile.
        /// </summary>
        public LocTextBridge TileTitle { get; set; }

        /// <summary>
        ///     Gets or sets the tile type.
        /// </summary>
        public LocTextBridge TileType { get; set; }

        /// <summary>
        ///     Gets or sets the tile description.
        /// </summary>
        public LocTextBridge TileDescription { get; set; }

        /// <summary>
        ///     Gets or sets content image path.
        /// </summary>
        public string ContentImagePath { get; set; }

        /// <summary>
        ///     Gets or sets title image path.
        /// </summary>
        public string TileImagePath { get; set; }

        /// <summary>
        ///     Gets or sets the timer.
        /// </summary>
        public TimerBridge Timer { get; set; }
    }
}
