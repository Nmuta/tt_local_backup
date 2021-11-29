using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Validated Sunrise ban parameters, as stored internally.
    /// </summary>
    public sealed class PlayerAuction
    {
        /// <summary>
        ///     Gets or sets the id.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        ///     Gets or sets the item name.
        /// </summary>
        public string ItemName { get; set; }

        /// <summary>
        ///     Gets or sets the make id.
        /// </summary>
        public short MakeId { get; set; }

        /// <summary>
        ///     Gets or sets the model id.
        /// </summary>
        public short ModelId { get; set; }

        /// <summary>
        ///     Gets or sets the status.
        /// </summary>
        public AuctionStatus Status { get; set; }

        /// <summary>
        ///     Gets or sets the created time.
        /// </summary>
        public DateTime CreatedDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the closing date.
        /// </summary>
        public DateTime ClosingDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the current price.
        /// </summary>
        public int CurrentPrice { get; set; }

        /// <summary>
        ///     Gets or sets the buyout price.
        /// </summary>
        public int BuyoutPrice { get; set; }

        /// <summary>
        ///     Gets or sets the bids.
        /// </summary>
        public int Bids { get; set; }

        /// <summary>
        ///     Gets or sets the livery image.
        /// </summary>
        public string LiveryImageBase64 { get; set; }

        /// <summary>
        ///     Gets or sets the texture map.
        /// </summary>
        public string TextureMapImageBase64 { get; set; }

        /// <summary>
        ///     Gets or sets the review state.
        /// </summary>
        public AuctionReviewState ReviewState { get; set; }

        /// <summary>
        ///     Gets or sets the total reports.
        /// </summary>
        public int TotalReports { get; set; }

        /// <summary>
        ///     Gets or sets the time flagged.
        /// </summary>
        public DateTime? TimeFlagged { get; set; }
    }
}
