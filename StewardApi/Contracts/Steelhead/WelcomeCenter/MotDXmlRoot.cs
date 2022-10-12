#pragma warning disable SA1604 // Element documentation should have summary
#pragma warning disable SA1627 // Documentation text should not be empty
#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1605 // Partial element documentation should have summary
#pragma warning disable SA1300 // Element should begin with upper-case letter

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Xml.Schema;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <remarks/>
    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRootAttribute("content-set", Namespace = "scribble:x", IsNullable = false)]
    public partial class MotDXmlRoot
    {
        /// <remarks/>
        [XmlElementAttribute("UserMessages.MessageOfTheDay", Namespace = "scribble:title-content")]
        public List<UserMessagesMessageOfTheDay> UserMessagesMessageOfTheDay { get; set; }
    }

    /// <remarks/>
    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRootAttribute("UserMessages.MessageOfTheDay", Namespace = "scribble:title-content", IsNullable = false)]
    public partial class UserMessagesMessageOfTheDay
    {
        /// <remarks/>
        public object ID { get; set; }

        /// <remarks/>
        [PegEdit]
        public string FriendlyMessageName { get; set; }

        /// <remarks/>
        public string LocationSceneEnum { get; set; }

        /// <remarks/>
        public string TelemetryTag { get; set; }

        /// <remarks/>
        public byte Priority { get; set; }

        /// <remarks/>
        public UserMessagesMessageOfTheDayUserGroups UserGroups { get; set; }

        /// <remarks/>
        public object Cooldowns { get; set; }

        /// <remarks/>
        public object CooldownDataList { get; set; }

        /// <remarks/>
        public object DisplayConditions { get; set; }

        /// <remarks/>
        public object DisplayConditionDataList { get; set; }

        /// <remarks/>
        public UserMessagesMessageOfTheDayTitleHeader TitleHeader { get; set; }

        /// <remarks/>
        [PegEdit]
        public DateTime Date { get; set; }

        /// <remarks/>
        public UserMessagesMessageOfTheDayContentHeader ContentHeader { get; set; }

        /// <remarks/>
        public UserMessagesMessageOfTheDayContentBody ContentBody { get; set; }

        /// <remarks/>
        [PegEdit]
        public string ContentImagePath { get; set; }

        /// <remarks/>
        [XmlAttributeAttribute(Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string when { get; set; }

        /// <remarks/>
        [XmlAttributeAttribute(AttributeName = "id", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid idAttribute { get; set; }
    }

    /// <remarks/>
    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class UserMessagesMessageOfTheDayUserGroups
    {
        /// <remarks/>
        [XmlElementAttribute(Namespace = "scribble:x")]
        public item item { get; set; }
    }

    /// <remarks/>
    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRootAttribute(Namespace = "scribble:x", IsNullable = false)]
    public partial class item
    {
        /// <remarks/>
        [XmlAttributeAttribute(Form = XmlSchemaForm.Qualified)]
        public string @ref { get; set; }
    }

    /// <remarks/>
    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    [PegEdit]
    public partial class UserMessagesMessageOfTheDayTitleHeader
    {
        /// <remarks/>
        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string @base { get; set; }

        /// <remarks/>
        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string description { get; set; }

        /// <remarks/>
        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string skiploc { get; set; }

        /// <remarks/>
        [XmlAttributeAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }

    /// <remarks/>
    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    [PegEdit]
    public partial class UserMessagesMessageOfTheDayContentHeader
    {
        /// <remarks/>
        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string @base { get; set; }

        /// <remarks/>
        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string skiploc { get; set; }

        /// <remarks/>
        [XmlAttributeAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }

    /// <remarks/>
    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    [PegEdit]
    public partial class UserMessagesMessageOfTheDayContentBody
    {
        /// <remarks/>
        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string @base { get; set; }

        /// <remarks/>
        [XmlElementAttribute(Namespace = "scribble:x")]
        [PegEdit]
        public string skiploc { get; set; }

        /// <remarks/>
        [XmlAttributeAttribute("loc-def", Form = XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }
}
