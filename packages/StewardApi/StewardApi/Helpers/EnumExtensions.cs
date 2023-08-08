using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions for enums.
    /// </summary>
    public static class EnumExtensions
    {
        /// <summary>
        ///     Enumerate the array of integer flags as if they were an enum of the given type.
        ///     Throws if an unexpected value is encountered.
        /// </summary>
        /// <typeparam name="T">Type of the enum to cast to.</typeparam>
        /// <param name="source">Integer source.</param>
        /// <returns>A list of the set flags.</returns>
        /// <exception cref="ArgumentException">When the source type is not an enum.</exception>
        /// <exception cref="InvalidOperationException">When an unexpected value is encountered.</exception>
        public static IEnumerable<T> AsEnumList<T>(this int[] source)
            where T : Enum
        {
            if (!typeof(T).IsEnum)
            {
                throw new ArgumentException("source must be an enum");
            }

            if (source == null || !source.Any())
            {
                yield break; // produces empty iterable
            }

            foreach (var item in source)
            {
                var isValidEnum = Enum.IsDefined(typeof(T), (T)(object)item);
                if (!isValidEnum)
                {
                    throw new InvalidOperationException($"'{item}' is not a valid value for the enum '{typeof(T).Name}'");
                }

                yield return (T)(object)item;
            }
        }

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

        /// <summary>
        ///     Gets string from Enum description if present, else returns enum.toString()
        ///     Pulled from: https://stackoverflow.com/questions/479410/enum-tostring-with-user-friendly-strings
        /// </summary>
        public static string GetDescription<T>(this T enumerationValue)
            where T : Enum
        {
            var type = enumerationValue.GetType();
            if (!type.IsEnum)
            {
                throw new ArgumentException("EnumerationValue must be of Enum type", "enumerationValue");
            }

            var memberInfo = type.GetMember(enumerationValue.ToString());
            if (memberInfo != null && memberInfo.Length > 0)
            {
                var attrs = memberInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);

                if (attrs != null && attrs.Length > 0)
                {
                    //Pull out the description value
                    return ((DescriptionAttribute)attrs[0]).Description;
                }
            }
            
            return enumerationValue.ToString();
        }
    }
}
