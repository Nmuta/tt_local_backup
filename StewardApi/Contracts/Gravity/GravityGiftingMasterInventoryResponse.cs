using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity player inventory.
    /// </summary>
    public sealed class GravityGiftingMasterInventoryResponse
    {
        /// <summary>
        ///     Gets or sets the Turn 10 ID.
        /// </summary>
        public string T10Id { get; set; }

        /// <summary>
        ///     Gets or sets the currencies.
        /// </summary>
        public IList<GiftingMasterInventoryItemResponse> Currencies { get; set; } = new List<GiftingMasterInventoryItemResponse>();

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<GiftingMasterInventoryItemResponse> Cars { get; set; } = new List<GiftingMasterInventoryItemResponse>();

        /// <summary>
        ///     Gets or sets the mastery kits.
        /// </summary>
        public IList<GiftingMasterInventoryItemResponse> MasteryKits { get; set; } = new List<GiftingMasterInventoryItemResponse>();

        /// <summary>
        ///     Gets or sets the upgrade kits.
        /// </summary>
        public IList<GiftingMasterInventoryItemResponse> UpgradeKits { get; set; } = new List<GiftingMasterInventoryItemResponse>();

        /// <summary>
        ///     Gets or sets the repair kits.
        /// </summary>
        public IList<GiftingMasterInventoryItemResponse> RepairKits { get; set; } = new List<GiftingMasterInventoryItemResponse>();

        /// <summary>
        ///     Gets or sets the energy refills.
        /// </summary>
        public IList<GiftingMasterInventoryItemResponse> EnergyRefills { get; set; } = new List<GiftingMasterInventoryItemResponse>();
    }
}
