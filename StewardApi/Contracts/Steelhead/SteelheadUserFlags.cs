#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead user flags.
    /// </summary>
    public sealed class SteelheadUserFlags
    {
        public bool IsGamecoreVip { get; set; }

        public bool IsGamecoreUltimateVip { get; set; }

        public bool IsSteamVip { get; set; }

        public bool IsSteamUltimateVip { get; set; }

        public bool IsTurn10Employee { get; set; }

        public bool IsEarlyAccess { get; set; }

        public bool IsUnderReview { get; set; }

        public bool IsRaceMarshall { get; set; }

        public bool IsContentCreator { get; set; }
    }
}
