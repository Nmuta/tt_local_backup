using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a gift that can expire.
    /// </summary>
    public class ExpirableGift : Gift
    {
        /// <summary>
        ///     Gets or sets the timespan in days after which the gift will expire.
        /// </summary>
        public uint ExpireTimeSpanInDays { get; set; }
    }
}
