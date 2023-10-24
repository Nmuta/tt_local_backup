using System;
using System.Collections.Generic;

#pragma warning disable SA1600 // Elements should be documented
namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead player inventory car item.
    /// </summary>
    public class SteelheadPlayerInventoryCarItem : SteelheadPlayerInventoryItem
    {
        public Guid Vin { get; set; }

        public Guid? VersionedLiveryId { get; set; }

        public Guid? VersionedTuneId { get; set; }

        public uint CurrentLevel { get; set; }

        public uint ExperiencePoints { get; set; }

        public uint CarPointsTotal { get; set; }

        public ulong Flags { get; set; }

        public SteelheadItemAcquisitionType AcquisitionType { get; set; }

        public IEnumerable<byte> ClientCarInfo { get; set; }

        public double PurchasePrice { get; set; }

        public string EntitlementId { get; set; }

        public IEnumerable<uint> TiersAchieved { get; set; }

        // Unused properties that we need to pass through to LSP
        public DateTime LastUsedTime { get; set; }

        public int CollectorScore { get; set; }

        public int ProductionNumber { get; set; }

        public bool IsOnlineOnly { get; set; }

        public bool Unredeemed { get; set; }

        public int BaseCost { get; set; }

        public uint CarId { get; set; }

        public DateTime PurchaseTimestamp { get; set; }
    }
}
