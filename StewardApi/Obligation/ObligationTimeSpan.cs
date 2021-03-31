using System;
using System.Globalization;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Simplifies the JSON object used to create a time span.
    /// </summary>
    public sealed class ObligationTimeSpan
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ObligationTimeSpan"/> class.
        /// </summary>
        public ObligationTimeSpan(TimeSpan timeSpan)
        {
            this.Days = timeSpan.Days;
            this.Hours = timeSpan.Hours;
            this.Minutes = timeSpan.Minutes;
        }

        /// <summary>
        ///     Gets or sets the days.
        /// </summary>
        public int Days { get; set; }

        /// <summary>
        ///     Gets or sets the hours.
        /// </summary>
        public int Hours { get; set; }

        /// <summary>
        ///     Gets or sets the minutes.
        /// </summary>
        public int Minutes { get; set; }

        /// <summary>
        ///     Outputs a time span.
        /// </summary>
        public TimeSpan ToTimeSpan()
        {
            return TimeSpan.Parse($"{this.Days}:{this.Hours}:{this.Minutes}:00", DateTimeFormatInfo.InvariantInfo);
        }
    }
}
