using System;
using Newtonsoft.Json;

namespace Turn10.LiveOps.StewardApi.Obligation.UpstreamModels
{
    /// <summary>
    ///     Represents the space between a start and end date.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public struct TimeRange : IEquatable<TimeRange>
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

        /// <summary>
        ///     Operator overload for comparing timeranges by value.
        /// </summary>
        public static bool operator ==(TimeRange left, TimeRange right)
        {
            return left.Equals(right);
        }

        /// <summary>
        ///     Operator overload for comparing timeranges by value.
        /// </summary>
        public static bool operator !=(TimeRange left, TimeRange right)
        {
            return !(left == right);
        }

        /// <inheritdoc />
        public override bool Equals(object obj)
        {
            return obj is TimeRange range
                && this.Start.Equals(range.Start)
                && this.End.Equals(range.End);
        }

        /// <inheritdoc />
        public override int GetHashCode()
        {
            return HashCode.Combine(this.Start, this.End);
        }

        /// <inheritdoc />
        public bool Equals(TimeRange other)
        {
            return this.Equals(other);
        }
    }
}
