using System;
using System.Collections.Generic;
using System.Linq;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions for enums.
    /// </summary>
    public static class EnumExtensions
    {
        /// <summary>
        ///     Enumerate the flags of a Flag Enum.
        /// </summary>
        /// <typeparam name="T">Type of the enum.</typeparam>
        /// <param name="source">Source value.</param>
        /// <returns>A list of the set flags.</returns>
        /// <exception cref="ArgumentException">When the source value is not a Flags enum.</exception>
        public static IEnumerable<T> ExpandFlags<T>(this T source)
            where T : Enum
        {
            if (!typeof(T).IsEnum)
            {
                throw new ArgumentException("source must be an enum");
            }

            if (typeof(T).GetCustomAttributes(typeof(FlagsAttribute), false).Length == 0)
            {
                throw new ArgumentException("source must be a flags enum");
            }

            foreach (T value in Enum.GetValues(source.GetType()))
            {
                if (source.HasFlag(value))
                {
                    yield return value;
                }
            }
        }

        /// <summary>
        ///     Enumerate the flags of a Flag Enum as strings.
        /// </summary>
        /// <typeparam name="T">Type of the enum.</typeparam>
        /// <param name="source">Source value.</param>
        /// <returns>A list of the set flags.</returns>
        /// <exception cref="ArgumentException">When the source value is not a Flags enum.</exception>
        public static IEnumerable<string> FlagsToStrings<T>(this T source)
            where T : Enum
        {
            return source.ExpandFlags().Select(f => Enum.GetName(typeof(T), f));
        }

        /// <summary>
        ///     Enumerate the flags of a Flag Enum as strings.
        /// </summary>
        /// <typeparam name="T">Type of the enum.</typeparam>
        /// <param name="source">Source value.</param>
        /// <returns>A list of the set flags.</returns>
        /// <exception cref="ArgumentException">When the source value is not a Flags enum.</exception>
        public static Dictionary<T, bool> FlagsToDictionary<T>(this T source)
            where T : Enum
        {
            if (!typeof(T).IsEnum)
            {
                throw new ArgumentException("source must be an enum");
            }

            if (typeof(T).GetCustomAttributes(typeof(FlagsAttribute), false).Length == 0)
            {
                throw new ArgumentException("source must be a flags enum");
            }

            var result = new Dictionary<T, bool>();

            foreach (T value in Enum.GetValues(source.GetType()))
            {
                result.Add(value, source.HasFlag(value));
            }

            return result;
        }
    }
}
