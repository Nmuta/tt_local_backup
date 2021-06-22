using System;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Validation
{
    /// <summary>
    ///     Contains extension methods for validation.
    /// </summary>
    public static class ValidationExtensions
    {
        /// <summary>
        ///     Throws an exception if string length is greater than maximum length.
        /// </summary>
        public static void ShouldBeUnderMaxLength(this string message, int maxLength, string stringName)
        {
            if (message.Length > maxLength)
            {
                throw new InvalidArgumentsStewardException($"{stringName} cannot be longer than {maxLength} characters.");
            }
        }

        /// <summary>
        ///     Throws an exception if duration is less than minimum timespan.
        /// </summary>
        public static void ShouldBeOverMinimumDuration(this TimeSpan duration, TimeSpan minimumTime, string durationName)
        {
            if (duration < minimumTime)
            {
                throw new InvalidArgumentsStewardException($"{durationName} cannot be less than {minimumTime}.");
            }

        }
    }
}
