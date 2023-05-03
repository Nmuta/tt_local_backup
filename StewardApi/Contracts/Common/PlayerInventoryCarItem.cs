using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a player inventory car item.
    /// </summary>
    public class PlayerInventoryCarItem : PlayerInventoryItem
    {
        /// <summary>
        ///     Gets or sets the Vehicle Identification Number.
        /// </summary>
        public Guid Vin { get; set; }

        /// <summary>
        ///     Gets or sets the Vehicle Identification Number.
        /// </summary>
        public Guid? VersionedLiveryId { get; set; }

        /// <summary>
        ///     Gets or sets the Vehicle Identification Number.
        /// </summary>
        public Guid? VersionedTuneId { get; set; }

        /// <summary>
        ///     Gets or sets the current level.
        /// </summary>
        public uint CurrentLevel { get; set; }

        /// <summary>
        ///     Gets or sets the experience points.
        /// </summary>
        public uint ExperiencePoints { get; set; }
    }
}
