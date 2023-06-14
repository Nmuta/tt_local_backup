using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions for double type.
    /// </summary>
    public static class DoubleExtensions
    {
        /// <summary>
        ///     Checks if a source double is greater than or equal to a specified value.
        /// </summary>
        public static void ShouldBeGreaterThanOrEqual(this double source, double value, string context)
        {
            if (source < value)
            {
                throw new BadRequestStewardException($"{context} must be greater than or equal to {value} provided: {source}");
            }
        }

        /// <summary>
        ///     Checks if a source double is less than or equal to a specified value.
        /// </summary>
        public static void ShouldBeLessThanOrEqual(this double source, double value, string context)
        {
            if (source > value)
            {
                throw new BadRequestStewardException($"{context} must be less than or equal to {value} provided: {source}");
            }
        }
    }
}
