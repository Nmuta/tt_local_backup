using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Useful extensions for dealing with tasks.
    /// </summary>
    public static class TaskExtensions
    {
        /// <summary>Prevents a task from throwing. Instead: Produce the default value for its result type.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input)
            => SuccessOrDefault(input, default(T), null as Action<Exception>);

        /// <summary>Prevents a task from throwing. Instead: Produce the provided defualt value.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue)
            => SuccessOrDefault(input, defaultValue, null as Action<Exception>);

        /// <summary>Prevents a task from throwing. Instead: default(T); and add the exception to the given list.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, IList<Exception> exceptions)
            => SuccessOrDefault(input, default(T), ex => exceptions.Add(ex));

        /// <summary>Prevents a task from throwing. Instead: defaultValue; and add the exception to the given list.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue, IList<Exception> exceptions)
            => SuccessOrDefault(input, defaultValue, ex => exceptions.Add(ex));

        /// <summary>Prevents a task from throwing. Instead: default(T); and invoke the provided callback.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, Action<Exception> callback)
            => SuccessOrDefault(input, default(T), callback);

        /// <summary>Prevents a task from throwing. Instead: defaultValue; add the exception to the given list; and invoke the provided callback.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue, IList<Exception> exceptions, Action<Exception> callback)
            => SuccessOrDefault(input, defaultValue, ex =>
            {
                exceptions.Add(ex);
                callback?.Invoke(ex);
            });

        /// <summary>Prevents a task from throwing. Instead: defaultValue; and invoke the provided callback.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static async Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue, Action<Exception> callback)
        {
            try
            {
                return await input.ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                callback?.Invoke(ex);
                return defaultValue;
            }
        }
    }
}
