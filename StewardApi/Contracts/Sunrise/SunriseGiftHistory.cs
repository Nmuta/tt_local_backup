﻿using System;
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
        /// <param name="playerId">The player ID.</param>
        /// <param name="title">The title.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="giftSendDateUtc">The gift send date.</param>
        /// <param name="giftInventory">The gift inventory.</param>
        public SunriseGiftHistory(string playerId, string title, string requestingAgent, DateTime giftSendDateUtc, SunrisePlayerInventory giftInventory)
        {
            playerId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(playerId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            giftInventory.ShouldNotBeNull(nameof(giftInventory));

            this.PlayerId = playerId;
            this.Title = title;
            this.RequestingAgent = requestingAgent;
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
        public SunrisePlayerInventory GiftInventory { get; set; }
    }
}
