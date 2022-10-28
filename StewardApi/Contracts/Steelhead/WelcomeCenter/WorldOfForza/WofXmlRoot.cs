#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1300 // Element should begin with upper-case letter
#pragma warning disable SA1600 // Elements should be documented
#pragma warning disable SA1601 // Partial elements should be documented
#pragma warning disable IDE1006 // Naming Styles

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Xml.Schema;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRoot("content-set", Namespace = "scribble:x", IsNullable = false)]
    public partial class WofXmlRoot
    {
        [XmlElement("WorldOfForza.WoFTileImageText", Namespace = "scribble:title-content")]
        public List<WorldOfForzaWoFTileImageText> WorldOfForzaWoFTileImageText { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRoot("WorldOfForza.WoFTileImageText", Namespace = "scribble:title-content", IsNullable = false)]
    public partial class WorldOfForzaWoFTileImageText
    {
        [PegEdit]
        public string FriendlyName { get; set; }

        [PegEdit]
        public string Size { get; set; }

        [PegEdit]
        public WorldOfForzaWoFTileImageTextTimer Timer { get; set; }

        public WorldOfForzaWoFTileImageTextDisplayConditions DisplayConditions { get; set; }

        public object Cooldowns { get; set; }

        public object CMSTileID { get; set; }

        [PegEdit]
        public LocalizableText TileTitle { get; set; }

        public LocalizableText TileType { get; set; }

        public LocalizableText TileDescription { get; set; }

        [PegEdit]
        public string TileImagePath { get; set; }

        public string TelemetryTag { get; set; }

        public LocalizableText PopupTitle { get; set; }

        public LocalizableText PopupHeader { get; set; }

        public LocalizableText PopupSubHeader { get; set; }

        public LocalizableText PopupDescription { get; set; }

        [PegEdit]
        public string ContentImagePath { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid id { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileImageTextTimer
    {
        // This type appears to be unused in the Pegasus xml.
        public object StartTextOverride { get; set; }

        // This type appears to be unused in the Pegasus xml.
        public object EndTextOverride { get; set; }

        [PegEdit]
        public string TimerType { get; set; }

        // This type appears to be unused in the Pegasus Xml.
        public WorldOfForzaWoFTileImageTextTimerTimeDisplayFrom TimeDisplayFrom { get; set; }

        // This type appears to be unused in the Pegasus Xml.
        public WorldOfForzaWoFTileImageTextTimerTimeDisplayTo TimeDisplayTo { get; set; }

        [PegEdit]
        [XmlElement("CustomRange")]
        public WorldOfForzaWoFTileImageTextTimerCustomRange CustomRange { get; set; }

        // ?
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string type { get; set; }
    }

    // This type appears to be unused in the Pegasus Xml.
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileImageTextTimerTimeDisplayFrom
    {
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }
    }

    // This type appears to be unused in the Pegasus Xml.
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileImageTextTimerTimeDisplayTo
    {
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileImageTextTimerCustomRange
    {
        [XmlElement("From")]
        [PegEdit]
        public WorldOfForzaWoFTileImageTextTimerCustomRangePoint[] From { get; set; }

        [PegEdit]
        [XmlElement("To")]
        public WorldOfForzaWoFTileImageTextTimerCustomRangePoint[] To { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileImageTextTimerCustomRangePoint
    {
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }

        // Check if this property can be DateTime.
        // TODO investigate XmlText, could replace AnonymousField
        [PegEdit(AnonymousField = true)]
        [XmlText]
        public string Text { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string when { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileImageTextDisplayConditions
    {
        [XmlElement(Namespace = "scribble:x")]
        public item item { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRoot(Namespace = "scribble:x", IsNullable = false)]
    public partial class item
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified)]
        public string @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class LocalizableText
    {
        [PegEdit(AddCdataMarkupToEntry = true)]
        [XmlElement(Namespace = "scribble:x")]
        public string @base { get; set; }

        [PegEdit]
        [XmlElement(Namespace = "scribble:x")]
        public string description { get; set; }

        [PegEdit]
        [XmlElement(Namespace = "scribble:x")]
        public string skiploc { get; set; }

        [XmlAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }
}