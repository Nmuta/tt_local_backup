using System;
using System.Data;
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
        public GiftHistory(string playerId, string title, string requesterObjectId, DateTime giftSendDateUtc, string giftInventory, string endpoint)
        {
            playerId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(playerId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            giftInventory.ShouldNotBeNullEmptyOrWhiteSpace(nameof(giftInventory));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            this.PlayerId = playerId;
            this.Title = title;
            this.RequesterObjectId = requesterObjectId;
            this.GiftSendDateUtc = giftSendDateUtc;
            this.GiftInventory = giftInventory;
            this.Endpoint = endpoint;
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

        /// <summary>
        ///     Gets or sets the LSP endpoint.
        /// </summary>
        public string Endpoint { get; set; }

        /// <summary>
        ///     Makes a query for gift history that this model can read.
        /// </summary>
        public static string MakeQuery(string playerId, string title, string endpoint)
        {
            return $"GiftHistory | where PlayerId == '{playerId}' and Title == '{title}' and Endpoint == '{endpoint}' | project PlayerId, Title, RequesterObjectId = coalesce(RequesterObjectId, RequestingAgent), GiftSendDateUtc, GiftInventory, Endpoint";
        }

        /// <summary>
        ///     Parses query results into a gift history object.
        /// </summary>
        public static GiftHistory FromQueryResult(IDataReader reader)
        {
            return new GiftHistory(
                reader.Get<string>(nameof(PlayerId)),
                reader.Get<string>(nameof(Title)),
                reader.Get<string>(nameof(RequesterObjectId)),
                reader.Get<DateTime>(nameof(GiftSendDateUtc)),
                reader.Get<string>(nameof(GiftInventory)),
                reader.Get<string>(nameof(Endpoint))
            );
        }
    }
}
