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
    public partial class WofImageTextRoot : XmlRootBase<WofImageTextRoot, WofImageTextEntry>
    {
        [XmlElement("WorldOfForza.WoFTileImageText", Namespace = "scribble:title-content")]
        public override List<WofImageTextEntry> Entries { get; set; }
    }

    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRoot("WorldOfForza.WoFTileImageText", Namespace = "scribble:title-content", IsNullable = false)]
    public partial class WofImageTextEntry : WofBaseTileEntry
    {
        public LocTextBaseWof PopupTitle { get; set; }

        public LocTextBaseWof PopupHeader { get; set; }

        public LocTextBaseWof PopupSubHeader { get; set; }

        public LocTextBaseWof PopupDescription { get; set; }

        [PegEdit]
        public string ContentImagePath { get; set; }
    }
}