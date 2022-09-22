using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StewardGitApi
{
    [DebuggerStepThrough, DebuggerNonUserCode]
    public static class Check
    {
        /// <summary>
        /// Checks the object for null.
        /// </summary>
        /// <param name="target">The target.</param>
        /// <param name="parameterName">Name of the parameter.</param>
        /// <param name="message">The message.</param>
        /// <exception cref="ArgumentNullException"></exception>
        public static T ForNull<T>(T target, string parameterName, string message = null) where T : class
        {
            if (target == null)
            {
                throw new ArgumentNullException(parameterName, message ?? string.Empty);
            }
            return target;
        }

        /// <summary>
        /// Checks the string for null, empty, or whitespace.
        /// </summary>
        /// <param name="target">The target.</param>
        /// <param name="parameterName">Name of the parameter.</param>
        /// <param name="message">The message.</param>
        /// <exception cref="System.ArgumentNullException"></exception>
        public static string ForNullEmptyOrWhiteSpace(string target, string parameterName, string message = null)
        {
            if (string.IsNullOrEmpty(target) || string.IsNullOrWhiteSpace(target))
            {
                throw new ArgumentNullException(parameterName, message ?? string.Empty);
            }
            return target;
        }

        /// <summary>
        /// Checks array of strings for null, empty, or whitespace.
        /// </summary>
        /// <param name="targets">The targets.</param>
        /// <param name="message">The message.</param>
        /// <exception cref="System.ArgumentNullException"></exception>
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
        /// Checks if the integer is greater than zero.
        /// </summary>
        /// <param name="target">The target.</param>
        /// <param name="parameterName">Name of the parameter.</param>
        /// <param name="message">The message.</param>
        public static int ForGreaterThanZero(int target, string parameterName, string message = null)
        {
            if (target <= 0)
            {
                throw new ArgumentOutOfRangeException(parameterName, message ?? $"{parameterName} must be greater than zero.");
            }
            return target;
        }

        /// <summary>
        /// Checks if the nullable integer is greater than zero.
        /// </summary>
        /// <param name="target">The target.</param>
        /// <param name="parameterName">Name of the parameter.</param>
        /// <param name="message">The message.</param>
        public static int? ForGreaterThanZero(int? target, string parameterName, string message = null)
        {
            if (target <= 0)
            {
                throw new ArgumentOutOfRangeException(parameterName, message ?? $"{parameterName} must be greater than zero.");
            }
            return target;
        }

        /// <summary>
        /// Checks if the integer is greater than or equal to zero.
        /// </summary>
        /// <param name="target">The target.</param>
        /// <param name="parameterName">Name of the parameter.</param>
        /// <param name="message">The message.</param>
        public static int ForGreaterOrEqualZero(int target, string parameterName, string message = null)
        {
            if (target < 0)
            {
                throw new ArgumentOutOfRangeException(parameterName, message ?? $"{parameterName} must be greater than or equal zero.");
            }
            return target;
        }

        /// <summary>
        /// Checks the enumerable for null or empty.
        /// </summary>
        /// <param name="target">The target.</param>
        /// <param name="parameterName">Name of the parameter.</param>
        /// <param name="message">The message.</param>
        /// <exception cref="System.ArgumentNullException"></exception>
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
