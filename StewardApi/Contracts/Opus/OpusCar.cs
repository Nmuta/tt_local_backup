using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Opus
{
    /// <summary>
    ///     Represents an Opus car.
    /// </summary>
    public sealed class OpusCar : IInventoryItem
    {
        /// <summary>
        ///     Gets or sets the base cost.
        /// </summary>
        public int BaseCost { get; set; }

        /// <summary>
        ///     Gets or sets the car ID.
        /// </summary>
        public int CarId { get; set; }

        /// <summary>
        ///     Gets or sets the date created.
        /// </summary>
        public DateTime DateCreatedUtc { get; set; }

        /// <summary>
        ///     Gets or sets the display name.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        ///     Gets or sets the special.
        /// </summary>
        public string Special { get; set; }

        /// <summary>
        ///     Gets or sets the version livery ID.
        /// </summary>
        public long VersionedLiveryId { get; set; }

        /// <summary>
        ///     Gets or sets the version tune ID.
        /// </summary>
        public long VersionedTuneId { get; set; }

        /// <summary>
        ///     Gets or sets the VIN.
        /// </summary>
        public Guid Vin { get; set; }

        /// <inheritdoc/>
        public int ItemId { get; set; } = -1;

        /// <inheritdoc/>
        public long Quantity { get; set; } = 1;

        /// <inheritdoc/>
        public DateTime AcquisitionUtc => this.DateCreatedUtc;

        /// <inheritdoc/>
        public DateTime LastUsedUtc => this.DateCreatedUtc;

        /// <inheritdoc/>
        public string Description => this.DisplayName;
    }
}
