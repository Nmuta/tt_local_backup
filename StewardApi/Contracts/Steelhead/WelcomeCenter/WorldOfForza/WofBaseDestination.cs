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
        public DeeplinkDestinationCategoryId CategoryId { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationCarId CarId { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationSetting Setting { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationCupId CupId { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationLadderId LadderId { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationSeriesId SeriesId { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationEventId EventId { get; set; }

        [WriteToPegasus]
        public LocTextBaseWof CategoryTitle { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationProduct Product { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationRacersCupSeries Series { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public string type { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationRacersCupSeries
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public Guid @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationCategoryId
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationCarId
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationSetting
    {
        [WriteToPegasus]
        public DeeplinkDestinationBuildersCupChampionship Championship { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationBuildersCupSeries Series { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationBuildersCupLadder Ladder { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationShowroomCar Car { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationShowroomManufacturer Manufacturer { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationStoreProduct Product { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationRivalsCategory Category { get; set; }

        [WriteToPegasus]
        public DeeplinkDestinationRivalsEvent Event { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public string type { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationBuildersCupChampionship
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public Guid @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationBuildersCupSeries
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public Guid @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationBuildersCupLadder
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public Guid @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationRivalsCategory
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public Guid @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationStoreProduct
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public Guid @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationShowroomManufacturer
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public Guid @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationShowroomCar
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public Guid @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationRivalsEvent
    {
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public Guid @ref { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationCupId
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationLadderId
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationSeriesId
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationEventId
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class DeeplinkDestinationProduct
    {
        [XmlElement(Namespace = "scribble:x")]
        [WriteToPegasus]
        public object @null { get; set; }
    }
}
