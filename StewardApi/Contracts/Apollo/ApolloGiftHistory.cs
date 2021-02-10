using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo gift history.
    /// </summary>
    public sealed class ApolloGiftHistory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloGiftHistory"/> class.
        /// </summary>
        /// <param name="idType">The ID type.</param>
        /// <param name="id">The ID.</param>
        /// <param name="title">The title.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="giftSendDateUtc">The gift send date.</param>
        /// <param name="giftInventory">The gift inventory.</param>
        public ApolloGiftHistory(GiftHistoryAntecedent idType, string id, string title, string requestingAgent, DateTime giftSendDateUtc, ApolloGift giftInventory)
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
        /// <remarks>
        ///     We make use of the JsonConverter to return the IdType string names instead of their integer values.
        ///     Xuid is a much more understandable ID type than 0.
        /// </remarks>
        [JsonConverter(typeof(StringEnumConverter))]
        public GiftHistoryAntecedent IdType { get; set; }

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
        public ApolloGift GiftInventory { get; set; }
    }
}
