using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise car.
    /// </summary>
    public sealed class SunriseCar : SunriseInventoryItem
    {
        /// <summary>
        ///     Gets or sets the base cost.
        /// </summary>
        public int BaseCost { get; set; }

        /// <summary>
        ///     Gets or sets the collector score.
        /// </summary>
        public int CollectorScore { get; set; }

        /// <summary>
        ///     Gets or sets the VIN.
        /// </summary>
        public Guid Vin { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether is online only.
        /// </summary>
        public bool IsOnlineOnly { get; set; }

        /// <summary>
        ///     Gets or sets the production number.
        /// </summary>
        public int ProductionNumber { get; set; }

        /// <summary>
        ///     Gets or sets the purchase time.
        /// </summary>
        public DateTime PurchaseUtc { get; set; }

        /// <summary>
        ///     Gets or sets the versioned livery ID.
        /// </summary>
        public Guid VersionedLiveryId { get; set; }

        /// <summary>
        ///     Gets or sets the versioned tune ID.
        /// </summary>
        public Guid VersionedTuneId { get; set; }
    }
}
