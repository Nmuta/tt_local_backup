using System;
using System.Collections.Generic;
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
            => SuccessOrDefault(input: input, defaultValue: default, callback: null);

        /// <summary>Prevents a task from throwing. Instead: Produce the provided default value.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue)
            => SuccessOrDefault(input: input, defaultValue: defaultValue, callback: null);

        /// <summary>Prevents a task from throwing. Instead: default(T); and add the exception to the given list.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, IList<Exception> exceptions)
            => SuccessOrDefault(input: input, defaultValue: default, callback: exceptions.Add);

        /// <summary>Prevents a task from throwing. Instead: defaultValue; and add the exception to the given list.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue, IList<Exception> exceptions)
            => SuccessOrDefault(input: input, defaultValue: defaultValue, callback: exceptions.Add);

        /// <summary>Prevents a task from throwing. Instead: default(T); and invoke the provided callback.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, Action<Exception> callback)
            => SuccessOrDefault(input: input, defaultValue: default, callback: callback);

        /// <summary>Prevents a task from throwing. Instead: defaultValue; add the exception to the given list; and invoke the provided callback.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue, IList<Exception> exceptions, Action<Exception> callback)
            => SuccessOrDefault(input: input, defaultValue: defaultValue, callback: ex =>
            {
                exceptions.Add(item: ex);
                callback?.Invoke(obj: ex);
            });

        /// <summary>Prevents a task from throwing. Instead: defaultValue; and invoke the provided callback.</summary>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static async Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue, Action<Exception> callback)
        {
            try
            {
                return await input.ConfigureAwait(continueOnCapturedContext: false);
            }
            catch (Exception ex)
            {
                callback?.Invoke(obj: ex);
                return defaultValue;
            }
        }
    }
}
