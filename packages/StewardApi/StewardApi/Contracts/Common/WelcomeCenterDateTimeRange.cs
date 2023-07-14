using System;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Pegasus)
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    public sealed class WelcomeCenterDateTimeRange
    {
        public DateTime? FromUtc { get; private set; }

        public DateTime? ToUtc { get; private set; }
    }
}
