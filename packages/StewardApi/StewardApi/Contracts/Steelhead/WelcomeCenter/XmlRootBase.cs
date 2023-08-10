#pragma warning disable CA1002 // Do not expose generic lists

using System.Collections.Generic;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     The base for deserialized xml models.
    /// </summary>
    /// <typeparam name="TRoot">Type of the xml root.</typeparam>
    /// <typeparam name="TEntry">Type of each entry of the xml root.</typeparam>
    public abstract class XmlRootBase<TRoot, TEntry>
    {
        /// <summary>
        ///     Gets or sets the list of entries.
        ///     Must use <c>[XmlIgnore]</c> on base property so derived
        ///     property's attributes resolve (de)serialization properly.
        /// </summary>
        [XmlIgnore]
        public abstract List<TEntry> Entries { get; set; }
    }
}
