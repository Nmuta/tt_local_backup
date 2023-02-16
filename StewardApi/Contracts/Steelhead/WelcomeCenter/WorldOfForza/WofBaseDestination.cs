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
        [PegEdit]
        public WorldOfForzaWoFTileDeeplinkDestinationCategory Category { get; set; }

        [PegEdit]
        public WorldOfForzaWoFTileDeeplinkDestinationCategoryId CategoryId { get; set; }

        [PegEdit]
        public WorldOfForzaWoFTileDeeplinkDestinationSetting Setting { get; set; }

        [PegEdit]
        public WorldOfForzaWoFTileDeeplinkDestinationCupId CupId { get; set; }

        [PegEdit]
        public WorldOfForzaWoFTileDeeplinkDestinationLadderId LadderId { get; set; }

        [PegEdit]
        public WorldOfForzaWoFTileDeeplinkDestinationSeriesId SeriesId { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [PegEdit]
        public string type { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationCategory
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [PegEdit]
        public string @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationCategoryId
    {
        [XmlElement(Namespace = "scribble:x")]
        [PegEdit]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationSetting
    {
        [PegEdit]
        public WorldOfForzaWoFTileDeeplinkDestinationSettingChampionship Championship { get; set; }

        [PegEdit]
        public WorldOfForzaWoFTileDeeplinkDestinationSettingSeries Series { get; set; }

        [PegEdit]
        public WorldOfForzaWoFTileDeeplinkDestinationSettingLadder Ladder { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [PegEdit]
        public string type { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationSettingChampionship
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [PegEdit]
        public string @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationSettingSeries
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [PegEdit]
        public string @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationSettingLadder
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [PegEdit]
        public string @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationCupId
    {
        [XmlElement(Namespace = "scribble:x")]
        [PegEdit]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationLadderId
    {
        [XmlElement(Namespace = "scribble:x")]
        [PegEdit]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class WorldOfForzaWoFTileDeeplinkDestinationSeriesId
    {
        [XmlElement(Namespace = "scribble:x")]
        [PegEdit]
        public object @null { get; set; }
    }
}
