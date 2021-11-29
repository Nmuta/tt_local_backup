#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint
{
    /// <summary>
    ///     Information on the history of a car from auction house. From LSP.
    /// </summary>
    public class AuctionDataCarHistory
    {
        public uint CurOwnerWinnings { get; set; }
        public uint CurOwnerNumRaces { get; set; }
        public uint HighestSkillScore { get; set; }
        public uint NumSkillPointsEarned { get; set; }
        public uint NumTimesSold { get; set; }
        public uint NumOwners { get; set; }
        public ulong CurOwnerPurchaseDate { get; set; }
        public uint NumRaces { get; set; }
        public uint NumPodiums { get; set; }
        public uint TotalRepairs { get; set; }
        public uint TotalWinnings { get; set; }
        public uint TimeDriven { get; set; }
        public uint DistanceDriven { get; set; }
        public uint Xp { get; set; }
        public uint NumVictories { get; set; }
        public string OriginalOwner { get; set; }
    }
}
