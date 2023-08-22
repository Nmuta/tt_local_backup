﻿#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup
{
    /// <summary>
    ///     Racer's Cup qualification options
    /// </summary>
    public sealed class RacersCupQualificationOptions
    {
        public RacersCupQualificationLimitType QualificationLimitType { get; set; }

        public byte NumberOfLimitedLaps { get; set; }

        public bool IsOneShot { get; set; }
    }
}
