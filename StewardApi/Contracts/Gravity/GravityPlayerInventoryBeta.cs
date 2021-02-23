using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a the new Gravity player inventory.
    ///     TODO: Rename to GravityPlayerInventory once we can delete the old one.
    /// </summary>
    public class GravityPlayerInventoryBeta : GravityMasterInventory
    {
        /// <summary>
        ///     Gets or sets the game settings ID.
        /// </summary>
        public Guid GameSettingsId { get; set; }

        /// <summary>
        ///     Gets or sets the external profile ID.
        /// </summary>
        public Guid ExternalProfileId { get; set; }
    }
}
