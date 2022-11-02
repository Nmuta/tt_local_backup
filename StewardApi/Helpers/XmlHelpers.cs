using System.IO;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Provides generic xml operations.
    /// </summary>
    public static class XmlHelpers
    {
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
            using var stringwriter = new StringWriter();
            using var xmlWriter = XmlWriter.Create(stringwriter, new XmlWriterSettings { Indent = true, Encoding = System.Text.Encoding.UTF8 });
            await Task.Run(() => new XmlSerializer(typeof(T)).Serialize(xmlWriter, obj, namespaces)).ConfigureAwait(false);
            return stringwriter.ToString();
        }
    }
}
