using System;
using Newtonsoft.Json;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Represents the space between a start and end date.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public struct TimeRange
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="TimeRange"/> struct.
        /// </summary>
        public TimeRange(DateTimeOffset start, DateTimeOffset end)
            : this()
        {
            // DateTimeOffset essentially caries two properties, a DateTime that is UTC and an Offset.
            // So we check that there is offset to make sure we are UTC. There is no hard system requirement for this
            // but a non UTC time is a bug 100% of the time so far.
            if (start.Offset != TimeSpan.Zero || end.Offset != TimeSpan.Zero)
            {
                throw new InvalidOperationException("TimeRange only accepts UTC times.");
            }

            if (start > end)
            {
                throw new InvalidOperationException("TimeRange, not time travel.");
            }

            this.Start = start;
            this.End = end;
        }

        /// <summary>
        ///     Gets or sets the start.
        /// </summary>
        [JsonProperty("start")]
        public DateTimeOffset Start { get; set; }

        /// <summary>
        ///     Gets or sets the end.
        /// </summary>
        [JsonProperty("end")]
        public DateTimeOffset End { get; set; }
    }
}
