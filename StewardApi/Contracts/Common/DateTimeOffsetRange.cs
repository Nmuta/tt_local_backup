using System;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a range of time
    /// </summary>
    public sealed class DateTimeOffsetRange
    {
        public DateTimeOffset From { get; set; }

        public DateTimeOffset To { get; set; }
    }
}
