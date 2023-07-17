using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a gift with localized title and body messages.
    /// </summary>
    public class LocalizedMessageGift : Gift
    {
        /// <summary>
        ///     Gets or sets the localized title message id.
        /// </summary>
        public Guid TitleMessageId { get; set; }

        /// <summary>
        ///     Gets or sets the localized body message id.
        /// </summary>
        public Guid BodyMessageId { get; set; }
    }
}
