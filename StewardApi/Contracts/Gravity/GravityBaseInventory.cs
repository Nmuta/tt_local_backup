using System;
using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity base inventory.
    /// </summary>
    public class GravityBaseInventory<T>
        where T : MasterInventoryItem
    {
        /// <summary>
        ///     Gets or sets the credit rewards.
        /// </summary>
        public IList<T> CreditRewards { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<T> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the mastery kits.
        /// </summary>
        public IList<T> MasteryKits { get; set; }

        /// <summary>
        ///     Gets or sets the upgrade kits.
        /// </summary>
        public IList<T> UpgradeKits { get; set; }

        /// <summary>
        ///     Gets or sets the repair kits.
        /// </summary>
        public IList<T> RepairKits { get; set; }

        /// <summary>
        ///     Gets or sets the energy refills.
        /// </summary>
        public IList<T> EnergyRefills { get; set; }
    }
}
