using System;
using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity player inventory.
    /// </summary>
    public class GravityPlayerInventory : GravityBaseInventory<PlayerInventoryItem>
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
