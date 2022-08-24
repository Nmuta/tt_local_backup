﻿#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Woodstock user flags as sent to the API.
    /// </summary>
    public sealed class WoodstockUserFlagsInput
    {
        public bool? IsVip { get; set; }

        public bool? IsUltimateVip { get; set; }

        public bool? IsTurn10Employee { get; set; }

        public bool? IsEarlyAccess { get; set; }

        public bool? IsUnderReview { get; set; }

        public bool? IsRaceMarshall { get; set; }

        public bool? IsContentCreator { get; set; }
    }
}
