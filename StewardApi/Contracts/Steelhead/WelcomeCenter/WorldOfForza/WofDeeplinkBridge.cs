using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum DestinationType
    {
        RacersCup,
        BuildersCup,
        Showroom
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum BuildersCupSettingType
    {
        Homepage,
        Series,
        Ladder
    }

    /// <summary>
    ///     World of Forza Image Text Tile Bridge.
    /// </summary>
    public class WofDeeplinkBridge
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
        ///     Gets or sets title image path.
        /// </summary>
        public string TileImagePath { get; set; }

        /// <summary>
        ///     Gets or sets the timer.
        /// </summary>
        public WofTimerBridge Timer { get; set; }

        /// <summary>
        ///     Gets or sets the destination championship.
        /// </summary>
        public Guid Championship { get; set; }

        /// <summary>
        ///     Gets or sets the destination series.
        /// </summary>
        public Guid Series { get; set; }

        /// <summary>
        ///     Gets or sets the destination ladder.
        /// </summary>
        public Guid Ladder { get; set; }

        /// <summary>
        ///     Gets or sets the destination showroom manufacturer.
        /// </summary>
        public Guid Manufacturer { get; set; }

        /// <summary>
        ///     Gets or sets the destination type.
        /// </summary>
        public DestinationType DestinationType { get; set; }

        /// <summary>
        ///     Gets or sets the builder's cup destination setting type.
        /// </summary>
        public BuildersCupSettingType? BuildersCupSettingType { get; set; }

        /// <summary>
        ///     Gets or sets the display conditions bridge.
        /// </summary>
        public WofDisplayConditionsBridge DisplayConditions { get; set; }
    }
}
