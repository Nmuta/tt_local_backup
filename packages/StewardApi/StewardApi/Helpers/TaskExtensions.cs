using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Useful extensions for dealing with tasks.
    /// </summary>
    [SuppressMessage("Style", @"VSTHRD200:Use ""Async"" suffix for async methods", Justification = "By design as these are task extensions.")]
    [SuppressMessage("Usage", "VSTHRD003:Avoid awaiting foreign Tasks", Justification = "By design as this is a task extension.")]
    public static class TaskExtensions
    {
        /// <summary>Prevents a task from throwing. Instead: Produce the default value for its result type.</summary>
        /// <remarks>Task result will never fail due to defaults. Cannot rely on Task.IsCompletedSuccessfully or Task.IsFaulted.</remarks>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input)
            => SuccessOrDefault(input: input, defaultValue: default, callback: null);

        /// <summary>Prevents a task from throwing. Instead: Produce the provided default value.</summary>
        /// <remarks>Task result will never fail due to defaults. Cannot rely on Task.IsCompletedSuccessfully or Task.IsFaulted.</remarks>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue)
            => SuccessOrDefault(input: input, defaultValue: defaultValue, callback: null);

        /// <summary>Prevents a task from throwing. Instead: default(T); and add the exception to the given list.</summary>
        /// <remarks>Task result will never fail due to defaults. Cannot rely on Task.IsCompletedSuccessfully or Task.IsFaulted.</remarks>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, IList<Exception> exceptions)
            => SuccessOrDefault(input: input, defaultValue: default, callback: exceptions.Add);

        /// <summary>Prevents a task from throwing. Instead: defaultValue; and add the exception to the given list.</summary>
        /// <remarks>Task result will never fail due to defaults. Cannot rely on Task.IsCompletedSuccessfully or Task.IsFaulted.</remarks>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue, IList<Exception> exceptions)
            => SuccessOrDefault(input: input, defaultValue: defaultValue, callback: exceptions.Add);

        /// <summary>Prevents a task from throwing. Instead: default(T); and invoke the provided callback.</summary>
        /// <remarks>Task result will never fail due to defaults. Cannot rely on Task.IsCompletedSuccessfully or Task.IsFaulted.</remarks>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, Action<Exception> callback)
            => SuccessOrDefault(input: input, defaultValue: default, callback: callback);

        /// <summary>Prevents a task from throwing. Instead: defaultValue; add the exception to the given list; and invoke the provided callback.</summary>
        /// <remarks>Task result will never fail due to defaults. Cannot rely on Task.IsCompletedSuccessfully or Task.IsFaulted.</remarks>
        /// <typeparam name="T">The return value of the task.</typeparam>
        public static Task<T> SuccessOrDefault<T>(this Task<T> input, T defaultValue, IList<Exception> exceptions, Action<Exception> callback)
            => SuccessOrDefault(input: input, defaultValue: defaultValue, callback: ex =>
            {
                exceptions.Add(item: ex);
                callback?.Invoke(obj: ex);
            });

        /// <summary>Prevents a task from throwing. Instead: defaultValue; and invoke the provided callback.</summary>
        /// <remarks>Task result will never fail due to defaults. Cannot rely on Task.IsCompletedSuccessfully or Task.IsFaulted.</remarks>
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
