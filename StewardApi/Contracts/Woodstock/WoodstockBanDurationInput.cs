using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Woodstock ban duration as sent to the API.
    /// </summary>
    public sealed class WoodstockBanDurationInput
    {
        /// <summary>
        ///     Gets or sets the duration.
        /// </summary>
        public TimeSpan? Duration { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to ban all devices.
        /// </summary>
        public bool? BanAllDevices { get; set; }

        /// <summary>
        ///     Gets or sets if the ban is permanent.
        /// </summary>
        public bool? IsPermanentBan { get; set; }
    }
}
