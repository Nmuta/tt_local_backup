using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents a Woodstock inventory profile.
    /// </summary>
    public sealed class WoodstockInventoryProfile
    {
        /// <summary>
        ///     Gets or sets the profile ID.
        /// </summary>
        public int ProfileId { get; set; }

        /// <summary>
        ///     Gets or sets the external profile ID.
        /// </summary>
        public Guid ExternalProfileId { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether profile is current.
        /// </summary>
        public bool IsCurrent { get; set; }

        /// <summary>
        ///     Gets or sets the device type.
        /// </summary>
        public string DeviceType { get; set; }
    }
}
