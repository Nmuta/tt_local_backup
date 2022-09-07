using System;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a message to send.
    /// </summary>
    public class CommunityMessage
    {
        public string Message { get; set; }

        /// <summary>
        ///     Gets or sets the Start Time UTC.
        /// </summary>
        /// <remarks>
        ///     Represents when the message will be made available to it's recipients.
        ///     Should be before ExpireTimeUtc, but can come before UTCNow without issue.
        /// </remarks>
        public DateTime StartTimeUtc { get; set; }

        public DateTime ExpireTimeUtc { get; set; }
    }
}
