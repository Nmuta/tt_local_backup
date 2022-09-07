using System;
using System.Linq;
using System.Text.RegularExpressions;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions for DateTimes.
    /// </summary>
    public static class DateTimeExtensions
    {
        /// <summary>
        ///     Verifies that source time comes before comparison time..
        /// </summary>
        /// <param name="source">The DateTime we're verifying.</param>
        /// <param name="compareTo">The DateTime we're comparing to.</param>
        /// <param name="sourceName">Name of source DateTime.</param>
        /// <param name="comparisonName">Name of compareTo DateTime.</param>
        public static void IsAfterOrThrows(this DateTime source, DateTime compareTo, string sourceName, string comparisonName)
        {
            if (source <= compareTo)
            {
                throw new InvalidArgumentsStewardException($"{sourceName}: {source} must come after {comparisonName}: {compareTo}.");
            }
        }
    }
}
