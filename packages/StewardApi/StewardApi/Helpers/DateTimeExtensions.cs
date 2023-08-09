using System;
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

        /// <summary>
        ///     If source is DateTime.MinValue, return null. Else returns source.
        /// </summary>
        public static DateTime? CovertToNullIfMin(this DateTime source)
        {
            if (source == DateTime.MinValue)
            {
                return null;
            }

            return source;
        }
    }
}
