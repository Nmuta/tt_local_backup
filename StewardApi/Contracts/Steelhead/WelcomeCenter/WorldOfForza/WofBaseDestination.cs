#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1300 // Element should begin with upper-case letter
#pragma warning disable SA1600 // Elements should be documented
#pragma warning disable SA1601 // Partial elements should be documented
#pragma warning disable IDE1006 // Naming Styles

using System;
using System.ComponentModel;
using System.Xml.Schema;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WofBaseDestination
    {
        [WriteToPegasus]
        public WorldOfForzaWoFTileDeeplinkDestinationCategory Category { get; set; }

        [WriteToPegasus]
        public WorldOfForzaWoFTileDeeplinkDestinationCategoryId CategoryId { get; set; }

        [WriteToPegasus]
        public WorldOfForzaWoFTileDeeplinkDestinationSetting Setting { get; set; }

        [WriteToPegasus]
        public WorldOfForzaWoFTileDeeplinkDestinationCupId CupId { get; set; }

        [WriteToPegasus]
        public WorldOfForzaWoFTileDeeplinkDestinationLadderId LadderId { get; set; }

        [WriteToPegasus]
        public WorldOfForzaWoFTileDeeplinkDestinationSeriesId SeriesId { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public string type { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationCategory
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public string @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationCategoryId
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationSetting
    {
        [WriteToPegasus]
        public WorldOfForzaWoFTileDeeplinkDestinationSettingChampionship Championship { get; set; }

        [WriteToPegasus]
        public WorldOfForzaWoFTileDeeplinkDestinationSettingSeries Series { get; set; }

        [WriteToPegasus]
        public WorldOfForzaWoFTileDeeplinkDestinationSettingLadder Ladder { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public string type { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationSettingChampionship
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public string @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationSettingSeries
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public string @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationSettingLadder
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public string @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationCupId
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationLadderId
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationSeriesId
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }
}
