using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a localized message gift that can expire.
    /// </summary>
    public class LocalizedMessageExpirableGift : LocalizedMessageGift
    {
        /// <summary>
        ///     Gets or sets the timespan in days after which the gift will expire.
        /// </summary>
        public uint ExpireTimeSpanInDays { get; set; }
    }
}
