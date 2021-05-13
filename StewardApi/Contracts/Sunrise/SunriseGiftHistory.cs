using System;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise gift history.
    /// </summary>
    public sealed class SunriseGiftHistory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseGiftHistory"/> class.
        /// </summary>
        public SunriseGiftHistory(GiftIdentityAntecedent idType, string id, string title, string requesterObjectId, DateTime giftSendDateUtc, SunriseGift giftInventory)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            giftInventory.ShouldNotBeNull(nameof(giftInventory));

            this.IdType = idType;
            this.Id = id;
            this.Title = title;
            this.RequesterObjectId = requesterObjectId;
            this.GiftSendDateUtc = giftSendDateUtc;
            this.GiftInventory = giftInventory;
        }

        /// <summary>
        ///     Gets or sets the ID type.
        /// </summary>
        public GiftIdentityAntecedent IdType { get; set; }

        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public string Id { get; set; }

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
        public SunriseGift GiftInventory { get; set; }
    }
}
