using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a group gift that can expire.
    /// </summary>
    public class ExpirableGroupGift : ExpirableGift
    {
        /// <summary>
        ///     Gets or sets the xuid list.
        /// </summary>
        public IList<ulong> Xuids { get; set; }
    }
}
