#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1300 // Element should begin with upper-case letter
#pragma warning disable SA1600 // Elements should be documented
#pragma warning disable SA1601 // Partial elements should be documented
#pragma warning disable IDE1006 // Naming Styles

using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text.Json.Serialization;
using System.Xml.Schema;
using System.Xml.Serialization;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;

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

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseTileEntry
    {
        [PegEdit]
        public string FriendlyName { get; set; }

        [PegEdit]
        public string Size { get; set; }

        public WofBaseTimer Timer { get; set; }

        public WofBaseDisplayConditions DisplayConditions { get; set; }

        public object Cooldowns { get; set; }

        public object CMSTileID { get; set; }

        [PegEdit]
        public LocTextBaseWof TileTitle { get; set; }

        [PegEdit]
        public LocTextBaseWof TileType { get; set; }

        [PegEdit]
        public LocTextBaseWof TileDescription { get; set; }

        [PegEdit]
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
        // This prop appears to be unused in the Pegasus xml.
        public object StartTextOverride { get; set; }

        // This prop appears to be unused in the Pegasus xml.
        public object EndTextOverride { get; set; }

        public string TimerType { get; set; }

        public WofBaseTimeDisplayFrom TimeDisplayFrom { get; set; }

        public WofBaseTimeDisplayTo TimeDisplayTo { get; set; }

        [XmlElement("CustomRange")]
        public WofBaseTimerCustomRange CustomRange { get; set; }

        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string type { get; set; }
    }

    // This prop appears to be unused in the Pegasus Xml.
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseTimeDisplayFrom
    {
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }
    }

    // This prop appears to be unused in the Pegasus Xml.
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
        [PegEdit]
        [XmlElement("From")]
        public WofBaseRangePoint[] From { get; set; }

        [PegEdit]
        [XmlElement("To")]
        public WofBaseRangePoint[] To { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseRangePoint
    {
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }

        // TODO Check if this property can be DateTime.
        [PegEdit(AnonymousField = true)]
        [XmlText]
        public string Text { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string when { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseDisplayConditions
    {
        [XmlElement(Namespace = "scribble:x")]
        public BaseItem item { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRoot(Namespace = "scribble:x", IsNullable = false)]
    public partial class BaseItem
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified)]
        public string @ref { get; set; }
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

        [PegEdit]
        [XmlAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }

        [PegEdit]
        [XmlAttributeAttribute("loc-ref", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locref { get; set; }
    }
}