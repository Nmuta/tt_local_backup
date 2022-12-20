using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions that manipulate strings.
    /// </summary>
    public static class StringExtensions
    {
        private const string MatchEmailPattern = @"\S+?@\S+?\.\S+";
        private static readonly Regex rx = new Regex(MatchEmailPattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);

        /// <summary>
        ///     Converts the given string to dash-delimited snake-case.
        /// </summary>
        /// <param name="source">The input string.</param>
        /// <returns>A string like test-ugc-content from TestUGCContent.</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Globalization", "CA1308:Normalize strings to uppercase", Justification = "Not consistent with snake-case.")]
        public static string ToDashedSnakeCase(this string source)
        {
            if (string.IsNullOrWhiteSpace(source)) { return null; }
            var regex = new Regex(@"(?<=.)(?=[A-Z][a-z])|(?=[A-Z]$)|(?<=[a-z])(?=[A-Z])");
            var split = regex.Split(source);
            var lowerSplit = split.Select(s => s.ToLowerInvariant());
            return string.Join("-", lowerSplit);
        }

        /// <summary>
        ///     Deserializes xml string into an object.
        /// </summary>
        /// <typeparam name="T">The type to deserialize to.</typeparam>
        public static async Task<T> DeserializeAsync<T>(this string xml)
        {
            using TextReader reader = new StringReader(xml);
            using XmlReader xmlreader = XmlReader.Create(reader);
            return await Task.Run(() => (T)new XmlSerializer(typeof(T)).Deserialize(xmlreader)).ConfigureAwait(false);
        }

        /// <summary>
        ///     Extracts emails from string.
        /// </summary>
        public static MatchCollection ExtractEmail(this string source)
        {
            if (string.IsNullOrWhiteSpace(source)) { return null; }
            return rx.Matches(source);
        }
    }
}
