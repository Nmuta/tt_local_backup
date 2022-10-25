using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///      Represents a group gift with localized title and body messages.
    /// </summary>
    public class LocalizedMessageGroupGift : LocalizedMessageGift
    {
        /// <summary>
        ///     Gets or sets the xuid list.
        /// </summary>
        public IList<ulong> Xuids { get; set; }
    }
}
