using System.IO;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Generic xml operations.
    /// </summary>
    public static class XmlHelpers
    {
        /// <summary>
        ///     Serializes object into xml a string and writes to <paramref name="filename"/>.
        /// </summary>
        /// <typeparam name="T">The type to serialize to.</typeparam>
        public static async Task SerializeAsync<T>(string filename, T objectToSerialize)
        {
            var xmlWriterSettings = new XmlWriterSettings() { Indent = true };
            using var writer = XmlWriter.Create(new FileStream(filename, FileMode.Create), xmlWriterSettings);
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
