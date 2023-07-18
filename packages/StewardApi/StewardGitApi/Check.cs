using System.Diagnostics;

namespace StewardGitApi
{
    /// <summary>
    ///     Provides basic error checking.
    /// </summary>
    [DebuggerStepThrough]
    [DebuggerNonUserCode]
    public static class Check
    {
        /// <summary>
        ///     Checks the object for null.
        /// </summary>
        /// <typeparam name="T">The type of target.</typeparam>
        public static T CheckForNull<T>(this T target, string parameterName, string message = null)
            where T : class
        {
            return target ?? throw new ArgumentNullException(parameterName, message ?? string.Empty);
        }

        /// <summary>
        ///     Checks the string for null, empty, or whitespace.
        /// </summary>
        public static string CheckForNullEmptyOrWhiteSpace(this string target, string parameterName, string message = null)
        {
            return string.IsNullOrEmpty(target) || string.IsNullOrWhiteSpace(target)
                ? throw new ArgumentNullException(parameterName, message ?? string.Empty)
                : target;
        }

        /// <summary>
        ///     Checks array of strings for null, empty, or whitespace.
        /// </summary>
        public static bool CheckForNullEmptyOrWhiteSpace(this string[] targets, string message = null)
        {
            foreach (string target in targets)
            {
                if (string.IsNullOrEmpty(target) || string.IsNullOrWhiteSpace(target))
                {
                    throw new ArgumentNullException(target, message ?? string.Empty);
                }
            }

            return true;
        }

        /// <summary>
        ///     Checks if the integer is greater than zero.
        /// </summary>
        public static int CheckForGreaterThanZero(this int target, string parameterName, string message = null)
        {
            return target <= 0
                ? throw new ArgumentOutOfRangeException(parameterName, message ?? $"{parameterName} must be greater than zero.")
                : target;
        }

        /// <summary>
        ///     Checks if the nullable integer is greater than zero.
        /// </summary>
        public static int? CheckForGreaterThanZero(this int? target, string parameterName, string message = null)
        {
            return target <= 0
                ? throw new ArgumentOutOfRangeException(parameterName, message ?? $"{parameterName} must be greater than zero.")
                : target;
        }

        /// <summary>
        ///     Checks if the integer is greater than or equal to zero.
        /// </summary>
        public static int CheckForGreaterOrEqualZero(this int target, string parameterName, string message = null)
        {
            return target < 0
                ? throw new ArgumentOutOfRangeException(parameterName, message ?? $"{parameterName} must be greater than or equal zero.")
                : target;
        }

        /// <summary>
        ///     Checks the enumerable for null or empty.
        /// </summary>
        /// <typeparam name="T">The type of target.</typeparam>
        public static IEnumerable<T> CheckForNullOrEmpty<T>(this IEnumerable<T> target, string parameterName, string message = null)
        {
            return target == null || !target.Any()
                ? throw new ArgumentNullException(parameterName, message ?? string.Empty)
                : target;
        }
    }
}
