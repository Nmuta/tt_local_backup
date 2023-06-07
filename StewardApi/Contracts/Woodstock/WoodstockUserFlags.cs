#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents a Woodstock player flags.
    /// </summary>
    public sealed class WoodstockUserFlags
    {
        public bool IsVip { get; set; }

        public bool IsUltimateVip { get; set; }

        public bool IsTurn10Employee { get; set; }

        public bool IsEarlyAccess { get; set; }

        public bool IsUnderReview { get; set; }

        public bool IsRaceMarshall { get; set; }

        public bool IsCommunityManager { get; set; }

        public bool IsContentCreator { get; set; }
    }
}
