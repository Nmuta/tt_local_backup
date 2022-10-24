using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a player game details.
    /// </summary>
    public sealed class PlayerGameDetails
    {
        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets the last login date in universal time.
        /// </summary>
        public DateTime LastLoginDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the first login date in universal time.
        /// </summary>
        public DateTime FirstLoginDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the CMS slot version.
        /// </summary>
        public int CmsSlotVersion { get; set; }

        /// <summary>
        ///     Gets or sets the CMS slot id override.
        /// </summary>
        public string CmsSlotIdOverride { get; set; }

        /// <summary>
        ///     Gets or sets the CMS environment override.
        /// </summary>
        public string CmsEnvironmentOverride { get; set; }

        /// <summary>
        ///     Gets or sets the CMS snapshot id.
        /// </summary>
        public string CmsSnapshotId { get; set; }

        /// <summary>
        ///     Gets or sets the license plate used on in-game cars.
        /// </summary>
        public string LicensePlate { get; set; }
    }
}
