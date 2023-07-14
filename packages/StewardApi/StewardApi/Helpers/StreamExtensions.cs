using System.IO;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Stream extensions.
    /// </summary>
    public static class StreamExtensions
    {
        /// <summary>
        ///     Deserializes stream data into an object.
        /// </summary>
        /// <typeparam name="T">The type to deserialize to.</typeparam>
        public static async Task<T> DeserializeAsync<T>(this Stream stream)
        {
            using var reader = XmlReader.Create(stream);
            return await Task.Run(() => (T)new XmlSerializer(typeof(T)).Deserialize(reader)).ConfigureAwait(false);
        }
    }
}
