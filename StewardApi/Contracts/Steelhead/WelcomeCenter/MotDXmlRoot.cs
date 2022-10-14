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

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRootAttribute("content-set", Namespace = "scribble:x", IsNullable = false)]
    public partial class MotDXmlRoot
    {
        [XmlElementAttribute("UserMessages.MessageOfTheDay", Namespace = "scribble:title-content")]
        public List<UserMessagesMessageOfTheDay> UserMessagesMessageOfTheDay { get; set; }
    }

    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRootAttribute("UserMessages.MessageOfTheDay", Namespace = "scribble:title-content", IsNullable = false)]
    public partial class UserMessagesMessageOfTheDay
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

        public UserMessagesMessageOfTheDayTitleHeader TitleHeader { get; set; }

        [PegEdit]
        public DateTime Date { get; set; }

        public UserMessagesMessageOfTheDayContentHeader ContentHeader { get; set; }

        public UserMessagesMessageOfTheDayContentBody ContentBody { get; set; }

        [PegEdit]
        public string ContentImagePath { get; set; }

        [XmlAttributeAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string when { get; set; }

        [XmlAttributeAttribute(AttributeName = "id", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid idAttribute { get; set; }
    }

    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class UserMessagesMessageOfTheDayUserGroups
    {
        [XmlElementAttribute(Namespace = "scribble:x")]
        public item item { get; set; }
    }

    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRootAttribute(Namespace = "scribble:x", IsNullable = false)]
    public partial class item
    {
        [XmlAttributeAttribute(Form = XmlSchemaForm.Qualified)]
        public string @ref { get; set; }
    }

    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    [PegEdit]
    public partial class UserMessagesMessageOfTheDayTitleHeader
    {
        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string @base { get; set; }

        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string description { get; set; }

        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string skiploc { get; set; }

        [XmlAttributeAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }

    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    [PegEdit]
    public partial class UserMessagesMessageOfTheDayContentHeader
    {
        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string @base { get; set; }

        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string skiploc { get; set; }

        [XmlAttributeAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }

    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    [PegEdit]
    public partial class UserMessagesMessageOfTheDayContentBody
    {
        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string @base { get; set; }

        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string skiploc { get; set; }

        [XmlAttributeAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }
}
