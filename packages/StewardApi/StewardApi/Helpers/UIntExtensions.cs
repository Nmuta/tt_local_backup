using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions for uint type.
    /// </summary>
    public static class UIntExtensions
    {
        /// <summary>
        ///     Checks if a source uint is greater than or equal to a specified value.
        /// </summary>
        public static void ShouldBeGreaterThanOrEqual(this uint source, uint value, string context)
        {
            if (source < value)
            {
                throw new BadRequestStewardException($"{context} must be greater than or equal to {value} provided: {source}");
            }
        }

        /// <summary>
        ///     Checks if a source uint is less than or equal to a specified value.
        /// </summary>
        public static void ShouldBeLessThanOrEqual(this uint source, uint value, string context)
        {
            if (source > value)
            {
                throw new BadRequestStewardException($"{context} must be less than or equal to {value} provided: {source}");
            }
        }
    }
}
