using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Generic xml operations.
    /// </summary>
    public static class XmlHelpers
    {
        /// <summary>
        ///     Recursively builds a list of metadata from
        ///     deserialized xml object.
        /// </summary>
        public static void BuildXmlMetaDataRecursive(object target, List<(XName, object)> metadatas)
        {
            foreach (PropertyInfo property in target.GetType().GetProperties())
            {
                if (property.GetCustomAttribute<PegEditAttribute>() != null && property.PropertyType.IsClass && property.PropertyType != typeof(string))
                {
                    object value = property.GetValue(target);
                    if (value == null)
                    {
                        // safety measure in case someone marks an xml object property with [PegEdit],
                        // but that property doesn't have a value because the bridge did not have a value
                        // for it when the bridge was mapped to the xml object. So skip the current property
                        // and go to the next one. This avoids a null reference on `target` on the next recursive call.
                        continue;
                    }

                    XNamespace ns = property.DeclaringType.GetCustomAttribute<XmlTypeAttribute>().Namespace;
                    XName nn = ns + property.Name;
                    metadatas.Add((nn, null));

                    BuildXmlMetaDataRecursive(value, metadatas);
                }
                else if (property.GetCustomAttribute<PegEditAttribute>() != null)
                {
                    XNamespace ns = property.GetCustomAttribute<XmlElementAttribute>()?.Namespace ?? property.DeclaringType.GetCustomAttribute<XmlTypeAttribute>().Namespace;

                    string name = property.GetCustomAttribute<XmlElementAttribute>()?.ElementName;

                    XName nn = string.IsNullOrEmpty(name) ? ns + property.Name : ns + name;

                    metadatas.Add((nn, property.GetValue(target)));
                }
            }
        }

        /// <summary>
        ///     Recursively assigns property values to xml.
        /// </summary>
        public static int FillXmlRecursive(XElement el, List<(XName xname, object value)> metadatas, int index, XNamespace currentNamespace)
        {
            while (index < metadatas.Count)
            {
                (XName xname, object value) = metadatas[index];

                if (xname.Namespace != currentNamespace)
                {
                    return index;
                }

                if (value != null && (xname.Namespace == XmlConstants.NamespaceRoot || xname.Namespace == XmlConstants.NamespaceElement))
                {
                    el.Descendants(xname).First().Value = value.ToString();
                    index++;
                }
                else if (value == null && xname.Namespace == XmlConstants.NamespaceRoot)
                {
                    index = FillXmlRecursive(el.Descendants(xname).First(), metadatas, index + 1, metadatas[index + 1].xname.Namespace);
                }
            }

            return index + 1;
        }

        /// <summary>
        ///     Serializes object into an xml string and writes to file.
        /// </summary>
        /// <typeparam name="T">The type to serialize to.</typeparam>
        public static async Task SerializeAsync<T>(T objectToSerialize, string filename)
        {
            var xmlWriterSettings = new XmlWriterSettings() { Indent = true };
            using var writer = XmlWriter.Create(new FileStream(filename, FileMode.Create), xmlWriterSettings);
            await Task.Run(() => new XmlSerializer(typeof(T)).Serialize(writer, objectToSerialize)).ConfigureAwait(false);
        }

        /// <summary>
        ///     Serializes object into an xml string and writes to stream.
        /// </summary>
        /// <typeparam name="T">The type to serialize to.</typeparam>
        public static async Task SerializeAsync<T>(T objectToSerialize, Stream stream)
        {
            var xmlWriterSettings = new XmlWriterSettings() { Indent = true };
            using var writer = XmlWriter.Create(stream, xmlWriterSettings);
            await Task.Run(() => new XmlSerializer(typeof(T)).Serialize(writer, objectToSerialize)).ConfigureAwait(false);
        }

        /// <summary>
        ///     Deserializes xml string into an object.
        /// </summary>
        /// <typeparam name="T">The type to deserialize to.</typeparam>
        public static async Task<T> DeserializeAsync<T>(string xml)
        {
            using TextReader reader = new StringReader(xml);
            using XmlReader xmlreader = XmlReader.Create(reader);
            return await Task.Run(() => (T)new XmlSerializer(typeof(T)).Deserialize(xmlreader)).ConfigureAwait(false);
        }

        /// <summary>
        ///     Deserializes stream data into an object.
        /// </summary>
        /// <typeparam name="T">The type to deserialize to.</typeparam>
        public static async Task<T> DeserializeAsync<T>(Stream stream)
        {
            using var reader = XmlReader.Create(stream);
            return await Task.Run(() => (T)new XmlSerializer(typeof(T)).Deserialize(reader)).ConfigureAwait(false);
        }
    }
}
