#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1300 // Element should begin with upper-case letter
#pragma warning disable SA1600 // Elements should be documented
#pragma warning disable SA1601 // Partial elements should be documented
#pragma warning disable IDE1006 // Naming Styles
#pragma warning disable SA1516 // Elements should be separated by blank line

using Newtonsoft.Json.Converters;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Xml.Schema;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    /// <summary>
    ///     Tile sizes.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum TileSize
    {
        Medium,
        Large
    }

    /// <summary>
    ///     Timer types.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum TimerType
    {
        ToStartOrToEnd,
        ToEnd,
        ToStart,
    }

    /// <summary>
    ///     Timer instances. To be used
    ///     strictly for mapping purposes.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum TimerInstance
    {
        Ladder,
        Series,
        Season,
        Chapter,
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseTileEntry
    {
        [WriteToPegasus]
        public string FriendlyName { get; set; }

        [WriteToPegasus]
        public string Size { get; set; }

        [WriteToPegasus]
        public WofBaseTimer Timer { get; set; }

        [WriteToPegasus]
        public WofBaseDisplayConditions DisplayConditions { get; set; }

        public object Cooldowns { get; set; }

        public object CMSTileID { get; set; }

        [WriteToPegasus]
        public LocTextBaseWof TileTitle { get; set; }

        [WriteToPegasus]
        public LocTextBaseWof TileType { get; set; }

        [WriteToPegasus]
        public LocTextBaseWof TileDescription { get; set; }

        [WriteToPegasus]
        public string TileImagePath { get; set; }

        public string TelemetryTag { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid id { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseTimer
    {
        [WriteToPegasus]
        public TextOverride StartTextOverride { get; set; }

        [WriteToPegasus]
        public TextOverride EndTextOverride { get; set; }

        [WriteToPegasus]
        public TimerType TimerType { get; set; }

        public WofBaseTimeDisplayFrom TimeDisplayFrom { get; set; }

        public WofBaseTimeDisplayTo TimeDisplayTo { get; set; }

        [WriteToPegasus]
        [XmlElement("CustomRange")]
        public WofBaseTimerCustomRange CustomRange { get; set; }

        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }

        [WriteToPegasus]
        [XmlAttribute("type", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string TypeName { get; set; }

        [WriteToPegasus(IsMultiElement = true)]
        [XmlElement("Ladder", Type = typeof(Ladder))]
        [XmlElement("Series", Type = typeof(Series))]
        [XmlElement("Season", Type = typeof(Season))]
        [XmlElement("Chapter", Type = typeof(Chapter))]
        public WofBaseTimerReference TimerReference { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    public class TextOverride
    {
        [WriteToPegasus]
        [XmlAttribute("loc-ref", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid RefId { get; set; }
    }

    [Serializable]
    public class WofBaseTimerReference
    {
        [WriteToPegasus]
        [XmlAttribute("ref", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid RefId { get; set; }

        [XmlIgnore]
        public virtual TimerInstance TimerInstance { get; }
    }

    public class Ladder : WofBaseTimerReference { public override TimerInstance TimerInstance => TimerInstance.Ladder; }
    public class Series : WofBaseTimerReference { public override TimerInstance TimerInstance => TimerInstance.Series; }
    public class Season : WofBaseTimerReference { public override TimerInstance TimerInstance => TimerInstance.Season; }
    public class Chapter : WofBaseTimerReference { public override TimerInstance TimerInstance => TimerInstance.Chapter; }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseTimeDisplayFrom
    {
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseTimeDisplayTo
    {
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseTimerCustomRange
    {
        [WriteToPegasus]
        [XmlElement("From")]
        public WofBaseRangePoint From { get; set; }

        [WriteToPegasus]
        [XmlElement("To")]
        public WofBaseRangePoint To { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseRangePoint
    {
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }

        // TODO Check if this property can be DateTime.
        [WriteToPegasus]
        [XmlText]
        public string Text { get; set; }

        [WriteToPegasus]
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string when { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    public partial class WofBaseDisplayConditions
    {
        [WriteToPegasus(CreateIfNull = true)]
        [Required]
        [XmlElement(Namespace = "scribble:x")]
        public BaseItem[] item { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    public partial class BaseItem
    {
        [WriteToPegasus]
        [XmlAttribute("ref", Form = XmlSchemaForm.Qualified)]
        public Guid RefId { get; set; }

        [WriteToPegasus]
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string when { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class LocTextBaseWof
    {
        [XmlElement(Namespace = "scribble:x")]
        public string @base { get; set; }

        [XmlElement(Namespace = "scribble:x")]
        public string description { get; set; }

        [XmlElement(Namespace = "scribble:x")]
        public string skiploc { get; set; }

        [WriteToPegasus]
        [XmlAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid locdef { get; set; }

        [WriteToPegasus]
        [XmlAttribute("loc-ref", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid locref { get; set; }
    }
}