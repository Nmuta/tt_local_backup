using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions for ulong type.
    /// </summary>
    public static class UlongExtensions
    {
        /// <summary>
        ///     Xuid minimum provided by Xbox Live team. This could change in the future.
        /// </summary>
        private const ulong XuidMinimum = 0x0009000000000000UL;

        /// <summary>
        ///     Xuid maximum provided by Xbox Live team. This could change in the future.
        /// </summary>
        private const ulong XuidMaximum = 0x0009FFFFFFFFFFFFUL;

        /// <summary>
        ///     Checks if value meets XUID requirements.
        /// </summary>
        public static bool IsValidXuid(this ulong source)
        {
            return source is >= XuidMinimum and <= XuidMaximum;
        }

        /// <summary>
        ///     Ensures value meets XUID requirements, else throws.
        /// </summary>
        public static void EnsureValidXuid(this ulong source)
        {
            if (!source.IsValidXuid())
            {
                throw new BadRequestStewardException($"Provided XUID does not meet requirements: {source}");
            }

        }

        /// <summary>
        ///     Checks if all values meet XUID requirements.
        /// </summary>
        public static bool AreValidXuids(this IEnumerable<ulong> source)
        {
            var invalidXuids = source.Where(xuid => !xuid.IsValidXuid());

            return !invalidXuids.Any();
        }

        /// <summary>
        ///     Checks if all values meet XUID requirements.
        /// </summary>
        public static bool AreValidXuids(this IEnumerable<ulong> source, out IEnumerable<ulong> invalidXuids)
        {
            invalidXuids = source.Where(xuid => !xuid.IsValidXuid());

            return !invalidXuids.Any();
        }

        /// <summary>
        ///     Ensures all values meet XUID requirements, else throws.
        /// </summary>
        public static void EnsureValidXuids(this IEnumerable<ulong> source)
        {
            var invalidXuids = source.Where(xuid => !xuid.IsValidXuid()).ToArray();

            if (invalidXuids.Length > 0)
            {
                var invalidXuidsAsString = string.Join(", ", invalidXuids);
                throw new BadRequestStewardException(
                    $"Provided XUIDs do not meet requirements: {invalidXuidsAsString}");
            }
        }
    }
}
