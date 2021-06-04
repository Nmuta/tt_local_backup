using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a credit update.
    /// </summary>
    public sealed class CreditUpdate
    {
        /// <summary>
        ///     Gets or sets the event time stamp in UTC.
        /// </summary>
        public DateTime EventTimestampUtc { get; set; }

        /// <summary>
        ///     Gets or sets the device type.
        /// </summary>
        public string DeviceType { get; set; }

        /// <summary>
        ///     Gets or sets the credits after.
        /// </summary>
        public int CreditsAfter { get; set; }

        /// <summary>
        ///     Gets or sets the credit amount.
        /// </summary>
        public int CreditAmount { get; set; }

        /// <summary>
        ///     Gets or sets the scene name.
        /// </summary>
        public string SceneName { get; set; }

        /// <summary>
        ///     Gets or sets the total XP.
        /// </summary>
        public long TotalXp { get; set; }
    }
}
