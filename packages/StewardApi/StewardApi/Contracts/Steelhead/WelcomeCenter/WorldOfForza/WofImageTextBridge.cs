﻿namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
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
        public WofTimerBridge Timer { get; set; }

        /// <summary>
        ///     Gets or sets the display conditions bridge.
        /// </summary>
        public WofDisplayConditionsBridge DisplayConditions { get; set; }

        /// <summary>
        ///     Gets or sets the popup title.
        /// </summary>
        public LocTextBridge PopupTitle { get; set; }

        /// <summary>
        ///     Gets or sets the popup header.
        /// </summary>
        public LocTextBridge PopupHeader { get; set; }

        /// <summary>
        ///     Gets or sets the popup sub header.
        /// </summary>
        public LocTextBridge PopupSubHeader { get; set; }

        /// <summary>
        ///     Gets or sets the popup description.
        /// </summary>
        public LocTextBridge PopupDescription { get; set; }

        /// <summary>
        ///     Gets or sets when tag property.
        /// </summary>
        public string When { get; set; }
    }
}
