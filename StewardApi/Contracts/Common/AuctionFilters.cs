namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents player auction filters.
    /// </summary>
    public sealed class AuctionFilters
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="AuctionFilters"/> class.
        /// </summary>
        public AuctionFilters()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="AuctionFilters"/> class.
        /// </summary>
        public AuctionFilters(short cardId, short makeId, AuctionStatus status, AuctionSort sort)
        {
            this.CarId = cardId;
            this.MakeId = makeId;
            this.Status = status;
            this.Sort = sort;
        }

        /// <summary>
        ///     Gets or sets auction car id.
        /// </summary>
        public short CarId { get; set; }

        /// <summary>
        ///     Gets or sets auction make id.
        /// </summary>
        public short MakeId { get; set; }

        /// <summary>
        ///     Gets or sets auction status.
        /// </summary>
        public AuctionStatus Status { get; set; }

        /// <summary>
        ///     Gets or sets auction srt.
        /// </summary>
        public AuctionSort Sort { get; set; }
    }
}
