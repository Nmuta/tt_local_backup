#pragma warning disable SA1600 // Elements should be documented

using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead user flags.
    /// </summary>
    public sealed class SteelheadUserFlags
    {
        public VerifiedUserFlag IsGamecoreVip { get; set; }

        public VerifiedUserFlag IsGamecoreUltimateVip { get; set; }

        public VerifiedUserFlag IsSteamVip { get; set; }

        public VerifiedUserFlag IsSteamUltimateVip { get; set; }

        public VerifiedUserFlag IsTurn10Employee { get; set; }

        public VerifiedUserFlag IsEarlyAccess { get; set; }

        public VerifiedUserFlag IsUnderReview { get; set; }

        public VerifiedUserFlag IsRaceMarshall { get; set; }

        public VerifiedUserFlag IsContentCreator { get; set; }

        public VerifiedUserFlag IsCommunityManager { get; set; }
    }
}
