using System.Linq;
using System.Text.RegularExpressions;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions that manipulate strings.
    /// </summary>
    public static class StringExtensions
    {
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
    }
}
