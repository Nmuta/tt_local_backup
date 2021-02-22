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
        /// <param name="idType">The ID type.</param>
        /// <param name="id">The ID.</param>
        /// <param name="title">The title.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="giftSendDateUtc">The gift send date.</param>
        /// <param name="giftInventory">The gift inventory.</param>
        public SunriseGiftHistory(GiftIdentityAntecedent idType, string id, string title, string requestingAgent, DateTime giftSendDateUtc, SunriseGift giftInventory)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            giftInventory.ShouldNotBeNull(nameof(giftInventory));

            this.IdType = idType;
            this.Id = id;
            this.Title = title;
            this.RequestingAgent = requestingAgent;
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
        ///     Gets or sets the requesting agent.
        /// </summary>
        public string RequestingAgent { get; set; }

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
