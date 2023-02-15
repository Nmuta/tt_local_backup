#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1300 // Element should begin with upper-case letter
#pragma warning disable SA1600 // Elements should be documented
#pragma warning disable SA1601 // Partial elements should be documented
#pragma warning disable IDE1006 // Naming Styles

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRootAttribute("content-set", Namespace = "scribble:x", IsNullable = false)]
    public partial class LocalizedStringRoot
    {
        [XmlElementAttribute("Localization.LocalizedString", Namespace = "scribble:title-content")]
        public List<LocEntry> LocalizationEntries { get; set; }
    }

    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRootAttribute("Localization.LocalizedString", Namespace = "scribble:title-content", IsNullable = false)]
    public partial class LocEntry
    {
        public ushort MaxLength { get; set; }

        public LocLocText LocString { get; set; }

        public string Category { get; set; }

        public string SubCategory { get; set; }

        [XmlAttributeAttribute(Form = System.Xml.Schema.XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public Guid id { get; set; }
    }

    [SerializableAttribute]
    [DesignerCategoryAttribute("code")]
    [XmlTypeAttribute(AnonymousType = true, Namespace = "scribble:title-content")]
    public partial class LocLocText
    {
        [XmlElementAttribute(Namespace = "scribble:x")]
        public string @base { get; set; }

        [XmlElementAttribute(Namespace = "scribble:x")]
        public string description { get; set; }

        [XmlElementAttribute(Namespace = "scribble:x")]
        public string skiploc { get; set; }

        [XmlAttributeAttribute("loc-def", Form = System.Xml.Schema.XmlSchemaForm.Qualified, Namespace = "scribble:x")]
        public string locdef { get; set; }
    }
}
