using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity player inventory.
    /// </summary>
    public sealed class GravityMasterInventory
    {
        /// <summary>
        ///     Gets or sets the credit rewards.
        /// </summary>
        public IList<MasterInventoryItem> CreditRewards { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<MasterInventoryItem> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the mastery kits.
        /// </summary>
        public IList<MasterInventoryItem> MasteryKits { get; set; }

        /// <summary>
        ///     Gets or sets the upgrade kits.
        /// </summary>
        public IList<MasterInventoryItem> UpgradeKits { get; set; }

        /// <summary>
        ///     Gets or sets the repair kits.
        /// </summary>
        public IList<MasterInventoryItem> RepairKits { get; set; }

        /// <summary>
        ///     Gets or sets the energy refills.
        /// </summary>
        public IList<MasterInventoryItem> EnergyRefills { get; set; }
    }
}
