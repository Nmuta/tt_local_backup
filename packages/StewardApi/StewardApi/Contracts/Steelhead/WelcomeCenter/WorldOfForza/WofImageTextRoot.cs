#pragma warning disable SA1402 // File may only contain a single type
#pragma warning disable SA1300 // Element should begin with upper-case letter
#pragma warning disable SA1600 // Elements should be documented
#pragma warning disable SA1601 // Partial elements should be documented
#pragma warning disable IDE1006 // Naming Styles

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    /// <summary>
    ///     Collection of image text entries for World of Forza tile
    /// </summary>
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRoot("content-set", Namespace = "scribble:x", IsNullable = false)]
    public partial class WofImageTextRoot : XmlRootBase<WofImageTextRoot, WofImageTextEntry>
    {
        [XmlElement("WorldOfForza.WoFTileImageText", Namespace = "scribble:title-content")]
        public override List<WofImageTextEntry> Entries { get; set; }
    }

    /// <summary>
    ///    Image text entry for World of Forza tile
    /// </summary>
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRoot("WorldOfForza.WoFTileImageText", Namespace = "scribble:title-content", IsNullable = false)]
    public partial class WofImageTextEntry : WofBaseTileEntry
    {
        [WriteToPegasus]
        public LocTextBaseWof PopupTitle { get; set; }

        [WriteToPegasus]
        public LocTextBaseWof PopupHeader { get; set; }

        [WriteToPegasus]
        public LocTextBaseWof PopupSubHeader { get; set; }

        [WriteToPegasus]
        public LocTextBaseWof PopupDescription { get; set; }

        [WriteToPegasus]
        public string ContentImagePath { get; set; }
    }
}
