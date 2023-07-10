using System;
using System.Collections.Generic;

#pragma warning disable SA1600 // Elements should be documented
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a player inventory car item.
    /// </summary>
    public class PlayerInventoryCarItem : PlayerInventoryItem
    {
        public Guid Vin { get; set; }

        public Guid? VersionedLiveryId { get; set; }

        public Guid? VersionedTuneId { get; set; }

        public uint CurrentLevel { get; set; }

        public uint ExperiencePoints { get; set; }

        public ulong Flags { get; set; }

        public IEnumerable<byte> ClientCarInfo { get; set; }

        public double PurchasePrice { get; set; }

        public string EntitlementId { get; set; }

        public IEnumerable<uint> TiersAchieved { get; set; }
    }
}
