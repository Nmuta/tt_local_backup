using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise profile rollback.
    /// </summary>
    public sealed class SunriseProfileNote
    {
        /// <summary>
        ///     Gets or sets the date.
        /// </summary>
        public DateTime DateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the author.
        /// </summary>
        public string Author { get; set; }

        /// <summary>
        ///     Gets or sets the text.
        /// </summary>
        public string Text { get; set; }
    }
}