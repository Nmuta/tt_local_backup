using System;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a gift history.
    /// </summary>
    public sealed class GiftHistory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="GiftHistory"/> class.
        /// </summary>
        public GiftHistory(string playerId, string title, string requesterObjectId, DateTime giftSendDateUtc, string giftInventory)
        {
            playerId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(playerId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            giftInventory.ShouldNotBeNullEmptyOrWhiteSpace(nameof(giftInventory));

            this.PlayerId = playerId;
            this.Title = title;
            this.RequesterObjectId = requesterObjectId;
            this.GiftSendDateUtc = giftSendDateUtc;
            this.GiftInventory = giftInventory;
        }

        /// <summary>
        ///     Gets or sets the player ID.
        /// </summary>
        public string PlayerId { get; set; }

        /// <summary>
        ///     Gets or sets the Title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        ///     Gets or sets the requestor object ID.
        /// </summary>
        public string RequesterObjectId { get; set; }

        /// <summary>
        ///     Gets or sets the gift send date in universal time.
        /// </summary>
        public DateTime GiftSendDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets gift inventory.
        /// </summary>
        public string GiftInventory { get; set; }
    }
}
