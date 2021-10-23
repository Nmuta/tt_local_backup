using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint
{
    /// <summary>
    ///     Information on a car in the auction house. From LSP.
    /// </summary>
    public class AuctionDataCar
    {
        public bool WasOriginallyFromAuctionHouse { get; set; }
        public bool WasOriginallyGifted { get; set; }
        public float SpeedRating { get; set; }
        public float AccelerationRating { get; set; }
        public float LaunchRating { get; set; }
        public float BrakingRating { get; set; }
        public float HandlingRating { get; set; }
        public Guid VersionedLiveryId { get; set; }
        public Guid VersionedTuneId { get; set; }
        public AuctionDataCarHistory CarHistory { get; set; }
        public IList<byte> PartsInTrunk { get; set; }
        public Guid Vin { get; set; }
        public int LastAuctionId { get; set; }
        public int CarDivisionId { get; set; }
        public bool IsMotorsportEdition { get; set; }
        public bool IsReward { get; set; }
        public bool IsOnlineOnly { get; set; }
        public bool IsUnicorn { get; set; }
        public byte PowertrainId { get; set; }
        public short Make { get; set; }
        public short CarId { get; set; }
        public int GarageId { get; set; }
        public short ManColorIndex { get; set; }
        public byte CountryId { get; set; }
        public int DisplacementId { get; set; }
        public int AspirationTypeId { get; set; }
        public float PerformanceIndex { get; set; }
        public short PerformanceIndexFriendly { get; set; }
        public byte CarClass { get; set; }
        public short Year { get; set; }
        public float PeakPower { get; set; }
        public float PeakTorque { get; set; }
        public float CurbWeight { get; set; }
        public float WeightDistribution { get; set; }
        public bool IsLiveryLocked { get; set; }
        public short NumberOfLiveryContributors { get; set; }
    }
}
