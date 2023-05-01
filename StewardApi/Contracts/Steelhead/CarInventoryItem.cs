using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    #pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    #pragma warning disable SA1600 // Elements should be documented

    public class CarInventoryItem
    {
        public Guid Vin { get; set; }

        public Guid? VersionedLiveryId { get; set; }

        public Guid? VersionedTuneId { get; set; }

        public ulong Flags { get; set; }

        public IEnumerable<byte> ClientCarInfo { get; set; }

        public uint CarId { get; set; }

        public double PurchasePrice { get; set; }

        public string EntitlementId { get; set; }

        public uint CurrentLevel { get; set; }

        public uint ExperiencePoints { get; set; }

        public IEnumerable<uint> TiersAchieved { get; set; }
    }
}
