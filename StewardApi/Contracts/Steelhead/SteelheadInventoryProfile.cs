using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead inventory profile.
    /// </summary>
    public sealed class SteelheadInventoryProfile
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
        ///     Gets or sets a value indicating whether profile is current for a given environment.
        /// </summary>
        public bool IsCurrentByTitleId { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether profile is the most recently used.
        /// </summary>
        public bool IsCurrent { get; set; }

        /// <summary>
        ///     Gets or sets the device type of the profile.
        /// </summary>
        public string DeviceType { get; set; }

        /// <summary>
        ///     Gets or sets the Title ID.
        /// </summary>
        public int TitleId { get; set; }

        /// <summary>
        ///     Gets or sets the Title Name.
        /// </summary>
        public string TitleName { get; set; }
    }
}
