using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity car.
    /// </summary>
    public sealed class GravityCar : GravityInventoryItem
    {
        /// <summary>
        ///     Gets or sets the VIN.
        /// </summary>
        public Guid Vin { get; set; }

        /// <summary>
        ///     Gets or sets the purchase time.
        /// </summary>
        public DateTime PurchaseUtc { get; set; }

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
        public int ClientPr { get; set; }

        /// <summary>
        ///     Gets or sets the advanced car customization.
        /// </summary>
        public int AdvancedCarCustomization { get; set; }
    }
}
