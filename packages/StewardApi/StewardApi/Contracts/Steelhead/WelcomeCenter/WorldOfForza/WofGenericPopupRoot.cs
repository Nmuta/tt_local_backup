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
    ///     Collection of generic popups for World of Forza tile
    /// </summary>
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:x")]
    [XmlRoot("content-set", Namespace = "scribble:x", IsNullable = false)]
    public partial class WofGenericPopupRoot : XmlRootBase<WofGenericPopupRoot, WofGenericPopupEntry>
    {
        [XmlElement("WorldOfForza.WoFTileGenericPopup", Namespace = "scribble:title-content")]
        public override List<WofGenericPopupEntry> Entries { get; set; }
    }

    /// <summary>
    ///     Generic popup entry for World of Forza tile
    /// </summary>
    [Serializable]
    [DesignerCategory("code")]
    [XmlType(AnonymousType = true, Namespace = "scribble:title-content")]
    [XmlRoot("WorldOfForza.WoFTileGenericPopup", Namespace = "scribble:title-content", IsNullable = false)]
    public partial class WofGenericPopupEntry : WofBaseTileEntry
    {
        [WriteToPegasus]
        public LocTextBaseWof PopupTitle { get; set; }

        [WriteToPegasus]
        public LocTextBaseWof PopupDescription { get; set; }
    }
}
