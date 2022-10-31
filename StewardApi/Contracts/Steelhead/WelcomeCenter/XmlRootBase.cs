#pragma warning disable CA1002 // Do not expose generic lists

using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     The base for deserialized xml models.
    /// </summary>
    /// <typeparam name="TRoot">Type of the xml root.</typeparam>
    /// <typeparam name="TEntry">Type of each entry of the xml root.</typeparam>
    public abstract class XmlRootBase<TRoot, TEntry>
        where TEntry : IUniqueId
    {
        /// <summary>
        ///     Gets or sets the list of entries.
        ///     Must use <c>[XmlIgnore]</c> on base property so derived
        ///     property's attributes resolve (de)serialization properly.
        /// </summary>
        [XmlIgnore]
        public abstract List<TEntry> Entries { get; set; }

        /// <summary>
        ///     Stitches modified xml entry to root xml at the correct location.
        /// </summary>
        public async Task<string> StitchXmlAsync(XElement element, TRoot root, Guid searchId)
        {
            string elementStr = element.ToString();

            TEntry entry = await XmlHelpers.DeserializeAsync<TEntry>(elementStr).ConfigureAwait(false);

            for (int i = 0; i < this.Entries.Count; i++)
            {
                if (this.Entries[i].UniqueId == searchId)
                {
                    this.Entries[i] = entry;
                    break;
                }
            }

            var namespaces = new XmlSerializerNamespaces(new XmlQualifiedName[]
            {
                new XmlQualifiedName(
                    string.Empty,
                    WelcomeCenterHelpers.NamespaceRoot.NamespaceName),

                new XmlQualifiedName(
                    WelcomeCenterHelpers.NamespaceElementPrefix,
                    WelcomeCenterHelpers.NamespaceElement.NamespaceName),
            });

            string ret = await XmlHelpers.SerializeAsync(root, namespaces).ConfigureAwait(false);

            if (string.IsNullOrEmpty(ret))
            {
                throw new WelcomeCenterXmlException("Error occurred while stitching, ret is null or empty");
            }

            return ret;
        }
    }
}
