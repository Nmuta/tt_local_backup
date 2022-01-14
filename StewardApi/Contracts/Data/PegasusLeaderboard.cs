#pragma warning disable CS1591
#pragma warning disable SA1600
#pragma warning disable SA1604
namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a Pegasus leaderboard.
    /// </summary>
    public sealed class PegasusLeaderboard
    {
        public string Name { get; set; }

        public int GameScoreboardId { get; set; }

        public int TrackId { get; set; }

        public int ScoreboardType { get; set; }

        public int ScoreType { get; set; }

        /// <remarks>Nullable as some leaderboards do not use car classes (ex: Roads Discovered).</remarks>
        public int? ExpectedCarClass { get; set; }
    }
}
