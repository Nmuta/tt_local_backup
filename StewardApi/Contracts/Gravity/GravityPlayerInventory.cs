using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity player inventory.
    /// </summary>
    public sealed class GravityPlayerInventory
    {
        /// <summary>
        ///     Gets or sets the Xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the Turn 10 ID.
        /// </summary>
        public string T10Id { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<GravityCar> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the mastery kits.
        /// </summary>
        public IList<GravityInventoryItem> MasteryKits { get; set; }

        /// <summary>
        ///     Gets or sets the upgrade kits.
        /// </summary>
        public IList<GravityUpgradeKit> UpgradeKits { get; set; }

        /// <summary>
        ///     Gets or sets the repair kits.
        /// </summary>
        public IList<GravityRepairKit> RepairKits { get; set; }

        /// <summary>
        ///     Gets or sets the packs.
        /// </summary>
        public IList<GravityInventoryItem> Packs { get; set; }

        /// <summary>
        ///     Gets or sets the currencies.
        /// </summary>
        public IList<GravityInventoryItem> Currencies { get; set; }

        /// <summary>
        ///     Gets or sets the energy refills.
        /// </summary>
        public IList<GravityInventoryItem> EnergyRefills { get; set; }

        /// <summary>
        ///     Gets or sets the previous game settings ID.
        /// </summary>
        public Guid PreviousGameSettingsId { get; set; }

        /// <summary>
        ///     Gets or sets the current external profile ID.
        /// </summary>
        public Guid CurrentExternalProfileId { get; set; }
    }
}
