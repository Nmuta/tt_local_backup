using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a bulk community message.
    /// </summary>
    public sealed class BulkCommunityMessage : CommunityMessage
    {
        /// <summary>
        ///     Gets or sets the list of Xuids.
        /// </summary>
        public IList<ulong> Xuids { get; set; }
    }
}
