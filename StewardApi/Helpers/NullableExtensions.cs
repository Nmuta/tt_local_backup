namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Helpers for nullable types.
    /// </summary>
    public static class NullableExtensions
    {
        /// <summary>
        ///     Returns the provided default if the nullable type is null..
        /// </summary>
        /// <typeparam name="T">The type of the struct.</typeparam>
        public static T ValueOrDefault<T>(this T? source, T defaultValue)
            where T : struct
        {
            return source.HasValue ? source.Value : defaultValue;
        }
    }
}
