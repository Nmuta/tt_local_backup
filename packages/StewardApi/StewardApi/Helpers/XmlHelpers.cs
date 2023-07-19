using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Provides generic xml operations.
    /// </summary>
    public static class XmlHelpers
    {
        /// <summary>
        ///     Returns string representation of xml,
        ///     including the declaration if it exists.
        /// </summary>
        public static string ToXmlString(this XDocument xdoc, bool forceDeclaration = false, SaveOptions options = SaveOptions.None)
        {
            var newLine = (options & SaveOptions.DisableFormatting) == SaveOptions.DisableFormatting ? string.Empty : Environment.NewLine;

            if (xdoc.Declaration == null)
            {
                if (forceDeclaration)
                {
                    xdoc = new XDocument(new XDeclaration("1.0", "utf-8", null), xdoc.Root);
                    return xdoc.Declaration + newLine + xdoc.ToString(options);
                }

                return xdoc.ToString(options);
            }
            else
            {
                return xdoc.Declaration + newLine + xdoc.ToString(options);
            }
        }

        /// <summary>
        ///     Serializes object into an xml string and writes to file.
        /// </summary>
        /// <typeparam name="T">The type to serialize.</typeparam>
        public static async Task SerializeAsync<T>(T obj, string filename)
        {
            var xmlWriterSettings = new XmlWriterSettings() { Indent = true };
            using var writer = XmlWriter.Create(new FileStream(filename, FileMode.Create), xmlWriterSettings);
            await Task.Run(() => new XmlSerializer(typeof(T)).Serialize(writer, obj)).ConfigureAwait(false);
        }

        /// <summary>
        ///     Serializes object into an xml string and writes to stream.
        /// </summary>
        /// <typeparam name="T">The type to serialize.</typeparam>
        public static async Task SerializeAsync<T>(T obj, Stream stream)
        {
            var xmlWriterSettings = new XmlWriterSettings() { Indent = true };
            using var writer = XmlWriter.Create(stream, xmlWriterSettings);
            await Task.Run(() => new XmlSerializer(typeof(T)).Serialize(writer, obj)).ConfigureAwait(false);
        }

        /// <summary>
        ///     Serializes T obj into an xml string and returns it.
        /// </summary>
        /// <typeparam name="T">The type to serialize.</typeparam>
        public static async Task<string> SerializeAsync<T>(T obj, XmlSerializerNamespaces namespaces = null)
        {
            using var stringwriter = new Utf8StringWriter();
            using var xmlWriter = XmlWriter.Create(stringwriter, new XmlWriterSettings { Indent = true, Encoding = System.Text.Encoding.UTF8 });
            await Task.Run(() => new XmlSerializer(typeof(T)).Serialize(xmlWriter, obj, namespaces)).ConfigureAwait(false);
            return stringwriter.ToString();
        }

        private class Utf8StringWriter : StringWriter
        {
            public override Encoding Encoding => Encoding.UTF8;
        }
    }
}
