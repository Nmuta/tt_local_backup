using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity player inventory.
    /// </summary>
    public class GravityPlayerInventory : GravityMasterInventory
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
