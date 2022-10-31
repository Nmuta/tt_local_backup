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
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRoot("content-set", Namespace = "scribble:x", IsNullable = false)]
    public partial class WofRoot : XmlRootBase<WofRoot, WofEntry>
    {
        [XmlElement("WorldOfForza.WoFTileImageText", Namespace = "scribble:title-content")]
        public override List<WofEntry> Entries { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRoot("WorldOfForza.WoFTileImageText", Namespace = "scribble:title-content", IsNullable = false)]
    public partial class WofEntry : IUniqueId
    {
        [PegEdit]
        public string FriendlyName { get; set; }

        [PegEdit]
        public string Size { get; set; }

        [PegEdit]
        public WofTimer Timer { get; set; }

        public WofDisplayConditions DisplayConditions { get; set; }

        public object Cooldowns { get; set; }

        public object CMSTileID { get; set; }

        [PegEdit]
        public LocTextWof TileTitle { get; set; }

        public LocTextWof TileType { get; set; }

        public LocTextWof TileDescription { get; set; }

        [PegEdit]
        public string TileImagePath { get; set; }

        public string TelemetryTag { get; set; }

        public LocTextWof PopupTitle { get; set; }

        public LocTextWof PopupHeader { get; set; }

        public LocTextWof PopupSubHeader { get; set; }

        public LocTextWof PopupDescription { get; set; }

        [PegEdit]
        public string ContentImagePath { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid id { get; set; }

        [XmlIgnore]
        public Guid UniqueId => this.id;
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofTimer
    {
        // This prop appears to be unused in the Pegasus xml.
        public object StartTextOverride { get; set; }

        // This prop appears to be unused in the Pegasus xml.
        public object EndTextOverride { get; set; }

        [PegEdit]
        public string TimerType { get; set; }

        // This prop appears to be unused in the Pegasus Xml.
        public WofTimeDisplayFrom TimeDisplayFrom { get; set; }

        // This prop appears to be unused in the Pegasus Xml.
        public WofTimeDisplayTo TimeDisplayTo { get; set; }

        [PegEdit]
        [XmlElement("CustomRange")]
        public WofTimerCustomRange CustomRange { get; set; }

        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string type { get; set; }
    }

    // This prop appears to be unused in the Pegasus Xml.
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofTimeDisplayFrom
    {
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }
    }

    // This prop appears to be unused in the Pegasus Xml.
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofTimeDisplayTo
    {
        [XmlElement(Namespace = "scribble:x")]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofTimerCustomRange
    {
        [XmlElement("From")]
        [PegEdit]
        public WofRangePoint[] From { get; set; }

        [PegEdit]
        [XmlElement("To")]
        public WofRangePoint[] To { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofRangePoint
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
    public partial class WofDisplayConditions
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
    public partial class LocTextWof
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

        [PegEdit]
        [XmlAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }
}