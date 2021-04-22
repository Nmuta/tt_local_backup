using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise profile rollback.
    /// </summary>
    public sealed class SunriseProfileRollback
    {
        /// <summary>
        ///     Gets or sets the date.
        /// </summary>
        public DateTime DateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the rollback author.
        /// </summary>
        public string Author { get; set; }

        /// <summary>
        ///     Gets or sets the rollback details.
        /// </summary>
        public string Details { get; set; }
    }
}
