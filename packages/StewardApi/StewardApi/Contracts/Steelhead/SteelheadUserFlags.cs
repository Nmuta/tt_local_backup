#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead user flags.
    /// </summary>
    public sealed class SteelheadUserFlags
    {
        public SteelheadUserFlag IsGamecoreVip { get; set; }

        public SteelheadUserFlag IsGamecoreUltimateVip { get; set; }

        public SteelheadUserFlag IsSteamVip { get; set; }

        public SteelheadUserFlag IsSteamUltimateVip { get; set; }

        public SteelheadUserFlag IsTurn10Employee { get; set; }

        public SteelheadUserFlag IsEarlyAccess { get; set; }

        public SteelheadUserFlag IsUnderReview { get; set; }

        public SteelheadUserFlag IsRaceMarshall { get; set; }

        public SteelheadUserFlag IsContentCreator { get; set; }

        public SteelheadUserFlag IsCommunityManager { get; set; }
    }
}
