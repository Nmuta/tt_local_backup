using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a localized message group gift that can expire.
    /// </summary>
    public class LocalizedMessageExpirableGroupGift : LocalizedMessageExpirableGift
    {
        /// <summary>
        ///     Gets or sets the xuid list.
        /// </summary>
        public IList<ulong> Xuids { get; set; }
    }
}
