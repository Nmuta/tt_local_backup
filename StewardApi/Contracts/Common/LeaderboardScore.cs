using System;

#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a leaderboard score.
    /// </summary>
    public sealed class LeaderboardScore
    {
        public ulong Xuid { get; set; }

        public Guid Id { get; set; }

        public int Position { get; set; }

        public DateTime SubmissionTimeUtc { get; set; }

        public double Score { get; set; }

        public string CarClass { get; set; }

        public float CarPerformanceIndex { get; set; }

        public string Car { get; set; }

        public string CarDriveType { get; set; }

        public string Track { get; set; }

        public bool IsClean { get; set; }

        public bool StabilityManagement { get; set; }

        public bool AntiLockBrakingSystem { get; set; }

        public bool TractionControlSystem { get; set; }

        public bool AutomaticTransmission { get; set; }

        public DeviceType DeviceType { get; set; }
    }
}
