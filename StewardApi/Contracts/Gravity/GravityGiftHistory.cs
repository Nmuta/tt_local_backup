using System;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity gift history.
    /// </summary>
    public sealed class GravityGiftHistory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityGiftHistory"/> class.
        /// </summary>
        public GravityGiftHistory(GiftIdentityAntecedent idType, string id, string title, string requestingAgent, DateTime giftSendDateUtc, GravityGift giftInventory)
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
        public GravityGift GiftInventory { get; set; }
    }
}
