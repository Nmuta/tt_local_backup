using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a gift.
    /// </summary>
    public class Gift
    {
        /// <summary>
        ///     Gets or sets the gift reason.
        /// </summary>
        public string GiftReason { get; set; }

        /// <summary>
        ///     Gets or sets the timespan in days after which the gift will expire.
        /// </summary>
        public uint ExpireTimeSpanInDays { get; set; }
    }
}
