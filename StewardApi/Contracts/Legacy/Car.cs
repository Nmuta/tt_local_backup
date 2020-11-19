using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the Car.
    /// </summary>
    public sealed class Car : InventoryItem
    {
        /// <summary>
        ///     Gets or sets the VIN.
        /// </summary>
        public Guid Vin { get; set; }

        /// <summary>
        ///     Gets or sets the purchase timestamp.
        /// </summary>
        public DateTime PurchaseTimestamp { get; set; }

        /// <summary>
        ///     Gets or sets the current mastery rank.
        /// </summary>
        public int CurrentMasteryRank { get; set; }

        /// <summary>
        ///     Gets or sets the cumulative mastery.
        /// </summary>
        public int CumulativeMastery { get; set; }

        /// <summary>
        ///     Gets or sets the repair state.
        /// </summary>
        public int RepairState { get; set; }

        /// <summary>
        ///     Gets or sets the star points.
        /// </summary>
        public int StarPoints { get; set; }

        /// <summary>
        ///     Gets or sets the color.
        /// </summary>
        public int Color { get; set; }

        /// <summary>
        ///     Gets or sets the livery.
        /// </summary>
        public int Livery { get; set; }

        /// <summary>
        ///     Gets or sets the client PR.
        /// </summary>
        public int ClientPR { get; set; }

        /// <summary>
        ///     Gets or sets the advanced car customization.
        /// </summary>
        public int AdvancedCarCustomization { get; set; }

        /// <summary>
        ///     Gets or sets the collector score.
        /// </summary>
        public int CollectorScore { get; set; }

        /// <summary>
        ///     Gets or sets the production number.
        /// </summary>
        public int ProductionNumber { get; set; }

        /// <summary>
        ///     Gets or sets the versioned livery ID.
        /// </summary>
        public string VersionedLiveryId { get; set; }

        /// <summary>
        ///     Gets or sets the versioned tune ID.
        /// </summary>
        public string VersionedTuneId { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether is online only.
        /// </summary>
        public bool IsOnlineOnly { get; set; }

        /// <summary>
        ///     Gets or sets the base cost.
        /// </summary>
        public int BaseCost { get; set; }

        /// <summary>
        ///     Gets or sets the display name.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        ///     Gets or sets the special.
        /// </summary>
        public string Special { get; set; }
    }
}