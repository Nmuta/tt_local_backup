using System;
using System.ComponentModel;
using System.Xml.Schema;
using System.Xml.Serialization;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;

#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1601 // Partial elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Base timer for World of Forza
    /// </summary>
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    public partial class WofDisplayConditions
    {
        [WriteToPegasus]
        [XmlElement("item", Namespace = "scribble:x", IsNullable = false)]
        public DisplayConditionItem[] item { get; set; }
    }

    /// <summary>
    ///     Display Condition Item
    /// </summary>
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRoot(Namespace = "scribble:x", IsNullable = false)]
    public partial class DisplayConditionItem
    {
        [WriteToPegasus]
        [XmlAttribute("ref", Form = XmlSchemaForm.Qualified)]
        public Guid RefId { get; set; }

        [WriteToPegasus]
        [XmlAttribute("id", Form = XmlSchemaForm.Qualified)]
        public Guid id { get; set; }

        [WriteToPegasus]
        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string when { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        [WriteToPegasus]
        public string type { get; set; }

        [WriteToPegasus]
        [XmlElement(Namespace = "scribble:title-content")]
        public string FriendlyName { get; set; }

        [WriteToPegasus]
        [XmlElement(Namespace = "scribble:title-content")]
        public DateSettings DateSettings { get; set; }
    }

    /// <summary>
    ///     Date Settings
    /// </summary>
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRoot(Namespace = "scribble:title-content", IsNullable = false)]
    public partial class DateSettings
    {
        [WriteToPegasus]
        public WofBaseCustomRange Range { get; set; }
    }
}
