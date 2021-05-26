using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a bulk community message.
    /// </summary>
    public sealed class BulkCommunityMessage
    {
        /// <summary>
        ///     Gets or sets the list of Xuids.
        /// </summary>
        public IList<ulong> Xuids { get; set; }

        /// <summary>
        ///     Gets or sets the message.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        ///     Gets or sets the duration.
        /// </summary>
        public TimeSpan Duration { get; set; }
    }
}
