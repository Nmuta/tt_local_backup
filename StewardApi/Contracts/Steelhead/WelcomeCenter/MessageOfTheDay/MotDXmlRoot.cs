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

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.MessageOfTheDay
{
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRoot("content-set", Namespace = "scribble:x", IsNullable = false)]
    public partial class MotDXmlRoot : XmlRootBase<MotDXmlRoot, UserMessagesMessageOfTheDay>
    {
        [XmlElement("UserMessages.MessageOfTheDay", Namespace = "scribble:title-content")]
        public override List<UserMessagesMessageOfTheDay> Entries { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRoot("UserMessages.MessageOfTheDay", Namespace = "scribble:title-content", IsNullable = false)]
    public partial class UserMessagesMessageOfTheDay : IUniqueId
    {
        public object ID { get; set; }

        [PegEdit]
        public string FriendlyMessageName { get; set; }

        public string LocationSceneEnum { get; set; }

        public string TelemetryTag { get; set; }

        public byte Priority { get; set; }

        public UserMessagesMessageOfTheDayUserGroups UserGroups { get; set; }

        public object Cooldowns { get; set; }

        public object CooldownDataList { get; set; }

        public object DisplayConditions { get; set; }

        public object DisplayConditionDataList { get; set; }

        [PegEdit]
        public UserMessagesMessageOfTheDayTitleHeader TitleHeader { get; set; }

        [PegEdit]
        public string Date { get; set; }

        [PegEdit]
        public UserMessagesMessageOfTheDayContentHeader ContentHeader { get; set; }

        [PegEdit]
        public UserMessagesMessageOfTheDayContentBody ContentBody { get; set; }

        [PegEdit]
        public string ContentImagePath { get; set; }

        [XmlAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string when { get; set; }

        [XmlAttribute(AttributeName = "id", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid idAttribute { get; set; }

        [XmlIgnore]
        public Guid UniqueId => this.idAttribute;
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class UserMessagesMessageOfTheDayUserGroups
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
    public partial class UserMessagesMessageOfTheDayTitleHeader
    {
        [PegEdit]
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

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class UserMessagesMessageOfTheDayContentHeader
    {
        [PegEdit]
        [XmlElement(Namespace = "scribble:x")]
        public string @base { get; set; }

        [PegEdit]
        [XmlElement(Namespace = "scribble:x")]
        public string skiploc { get; set; }

        [PegEdit]
        [XmlAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class UserMessagesMessageOfTheDayContentBody
    {
        [PegEdit]
        [XmlElement(Namespace = "scribble:x")]
        public string @base { get; set; }

        [PegEdit]
        [XmlElement(Namespace = "scribble:x")]
        public string skiploc { get; set; }

        [PegEdit]
        [XmlAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }
}