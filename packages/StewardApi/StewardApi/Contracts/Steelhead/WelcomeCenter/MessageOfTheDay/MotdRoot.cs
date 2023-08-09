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

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.MessageOfTheDay
{
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRoot("content-set", Namespace = "scribble:x", IsNullable = false)]
    public partial class MotdRoot : XmlRootBase<MotdRoot, MotdEntry>
    {
        [XmlElement("UserMessages.MessageOfTheDay", Namespace = "scribble:title-content")]
        public override List<MotdEntry> Entries { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRoot("UserMessages.MessageOfTheDay", Namespace = "scribble:title-content", IsNullable = false)]
    public partial class MotdEntry
    {
        public object ID { get; set; }

        [WriteToPegasus]
        public string FriendlyMessageName { get; set; }

        public string LocationSceneEnum { get; set; }

        public string TelemetryTag { get; set; }

        public byte Priority { get; set; }

        public MotdUserGroups UserGroups { get; set; }

        public object Cooldowns { get; set; }

        public object CooldownDataList { get; set; }

        public object DisplayConditions { get; set; }

        public object DisplayConditionDataList { get; set; }

        [WriteToPegasus]
        public LocTextMotd TitleHeader { get; set; }

        [WriteToPegasus]
        public string Date { get; set; }

        [WriteToPegasus]
        public LocTextMotd ContentHeader { get; set; }

        [WriteToPegasus]
        public LocTextMotd ContentBody { get; set; }

        [WriteToPegasus]
        public string ContentImagePath { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string when { get; set; }

        [XmlAttribute(AttributeName = "id", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid idAttribute { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class MotdUserGroups
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
    public partial class LocTextMotd
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
        [XmlAttributeAttribute("loc-ref", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid locref { get; set; }
    }
}