using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Helpers for conversion of struct types.
    /// </summary>
    public static class StructExtensions
    {
        /// <summary>
        ///     Returns null instead of default when the source is equal to its default value;
        /// </summary>
        /// <typeparam name="T">The type of the struct.</typeparam>
        public static T? DefaultAsNull<T>(this T source)
            where T : struct
        {
            return source.Equals(default(T)) ? null : (T?)source;
        }
    }
}
