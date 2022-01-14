#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a leaderboard.
    /// </summary>
    public sealed class Leaderboard
    {
        public string Name { get; set; }

        public int GameScoreboardId { get; set; }

        public int TrackId { get; set; }

        public int ScoreboardTypeId { get; set; }

        public string ScoreboardType { get; set; }

        public int ScoreTypeId { get; set; }

        public string ScoreType { get; set; }

        public int CarClassId { get; set; }

        public string CarClass { get; set; }
    }
}
