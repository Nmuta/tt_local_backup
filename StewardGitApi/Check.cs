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
        public static T ForNull<T>(T target, string parameterName, string message = null)
            where T : class
        {
            return target ?? throw new ArgumentNullException(parameterName, message ?? string.Empty);
        }

        /// <summary>
        ///     Checks the string for null, empty, or whitespace.
        /// </summary>
        public static string ForNullEmptyOrWhiteSpace(string target, string parameterName, string message = null)
        {
            if (string.IsNullOrEmpty(target) || string.IsNullOrWhiteSpace(target))
            {
                throw new ArgumentNullException(parameterName, message ?? string.Empty);
            }

            return target;
        }

        /// <summary>
        ///     Checks array of strings for null, empty, or whitespace.
        /// </summary>
        public static bool ForNullEmptyOrWhiteSpace(string[] targets, string message = null)
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
        public static int ForGreaterThanZero(int target, string parameterName, string message = null)
        {
            return target <= 0
                ? throw new ArgumentOutOfRangeException(parameterName, message ?? $"{parameterName} must be greater than zero.")
                : target;
        }

        /// <summary>
        ///     Checks if the nullable integer is greater than zero.
        /// </summary>
        public static int? ForGreaterThanZero(int? target, string parameterName, string message = null)
        {
            return target <= 0
                ? throw new ArgumentOutOfRangeException(parameterName, message ?? $"{parameterName} must be greater than zero.")
                : target;
        }

        /// <summary>
        ///     Checks if the integer is greater than or equal to zero.
        /// </summary>
        public static int ForGreaterOrEqualZero(int target, string parameterName, string message = null)
        {
            return target < 0
                ? throw new ArgumentOutOfRangeException(parameterName, message ?? $"{parameterName} must be greater than or equal zero.")
                : target;
        }

        /// <summary>
        ///     Checks the enumerable for null or empty.
        /// </summary>
        /// <typeparam name="T">The type of target.</typeparam>
        public static IEnumerable<T> ForNullOrEmpty<T>(IEnumerable<T> target, string parameterName, string message = null)
        {
            if (target == null || !target.Any())
            {
                throw new ArgumentNullException(parameterName, message ?? string.Empty);
            }

            return target;
        }
    }
}
