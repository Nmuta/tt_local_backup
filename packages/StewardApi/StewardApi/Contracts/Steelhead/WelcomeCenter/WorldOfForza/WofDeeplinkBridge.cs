#pragma warning disable SA1402 // File may only contain a single type

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using Turn10.LiveOps.StewardApi.Helpers.JsonConverters;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum DestinationType
    {
        RacersCup,
        BuildersCup,
        Showroom,
        PatchNotes,
        Rivals,
        Store
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum BuildersCupSettingType
    {
        Homepage,
        Series,
        Ladder
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum RivalsSettingType
    {
        Homepage,
        Event,
        Category
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum ShowroomSettingType
    {
        Homepage,
        Manufacturer,
        Car
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum StoreSettingType
    {
        Homepage,
        Product
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
        ///     Gets or sets the destination showroom manufacturer.
        /// </summary>
        public Guid Manufacturer { get; set; }

        /// <summary>
        ///     Gets or sets the display conditions bridge.
        /// </summary>
        public WofDisplayConditionsBridge DisplayConditions { get; set; }

        /// <summary>
        ///     Gets or sets the destination.
        /// </summary>
        [JsonConverter(typeof(DestinationConverter))]
        public DeeplinkDestination Destination { get; set; }
    }

    /// <summary>
    ///     Base class for a deeplink destination.
    /// </summary>
    public class DeeplinkDestination
    {
        /// <summary>
        ///     Gets or sets the destination type.
        /// </summary>
        public DestinationType DestinationType { get; set; }
    }

    /// <summary>
    ///     Builders Cup deeplink destination.
    /// </summary>
    public class BuildersCupDestination : DeeplinkDestination
    {
        /// <summary>
        ///     Gets or sets the builder's cup destination setting type.
        /// </summary>
        public BuildersCupSettingType? SettingType { get; set; }

        /// <summary>
        ///     Gets or sets the destination championship.
        /// </summary>
        public Guid? Championship { get; set; }

        /// <summary>
        ///     Gets or sets the destination builders cup series.
        /// </summary>
        public Guid? Series { get; set; }

        /// <summary>
        ///     Gets or sets the destination ladder.
        /// </summary>
        public Guid? Ladder { get; set; }
    }

    /// <summary>
    ///     Racers Cup deeplink destination.
    /// </summary>
    public class RacersCupDestination : DeeplinkDestination
    {
        /// <summary>
        ///     Gets or sets the destination racers cup series.
        /// </summary>
        public Guid Series { get; set; }
    }

    /// <summary>
    ///     Patch Notes deeplink destination.
    /// </summary>
    public class PatchNotesDestination : DeeplinkDestination
    {
    }

    /// <summary>
    ///     Rivals destination.
    /// </summary>
    public class RivalsDestination : DeeplinkDestination
    {
        /// <summary>
        ///     Gets or sets the rivals destination setting type.
        /// </summary>
        public RivalsSettingType? SettingType { get; set; }

        /// <summary>
        ///     Gets or sets the destination rivals category.
        /// </summary>
        public Guid? Category { get; set; }

        /// <summary>
        ///     Gets or sets the destination rivals event.
        /// </summary>
        public Guid? Event { get; set; }
    }

    /// <summary>
    ///     Showroom deeplink destination.
    /// </summary>
    public class ShowroomDestination : DeeplinkDestination
    {
        /// <summary>
        ///     Gets or sets the showroom destination setting type.
        /// </summary>
        public ShowroomSettingType? SettingType { get; set; }

        /// <summary>
        ///     Gets or sets the destination showroom manufacturer.
        /// </summary>
        public Guid? Manufacturer { get; set; }

        /// <summary>
        ///     Gets or sets the destination showroom car.
        /// </summary>
        public Guid? Car { get; set; }
    }

    /// <summary>
    ///     Store deeplink destination.
    /// </summary>
    public class StoreDestination : DeeplinkDestination
    {
        /// <summary>
        ///     Gets or sets the showroom store setting type.
        /// </summary>
        public StoreSettingType? SettingType { get; set; }

        /// <summary>
        ///     Gets or sets the destination store product.
        /// </summary>
        public Guid? Product { get; set; }
    }
}
