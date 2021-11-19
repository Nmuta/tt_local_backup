using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint
{
    /// <summary>
    ///     Data about a single auction. From LSP.
    /// </summary>
    public class AuctionData
    {
        public Guid AuctionId { get; set; }
        public AuctionReviewState Status { get; set; }
        public ulong SellerXuid { get; set; }
        public Guid SellerProfileId { get; set; }
        public uint OpeningPrice { get; set; }
        public uint BuyoutPrice { get; set; }
        public uint CurrentPrice { get; set; }
        public DateTime CreatedDateUtc { get; set; }
        public DateTime ClosingDateUtc { get; set; }
        public bool IsVipAuction { get; set; }
        public bool IsTurn10Auction { get; set; }
        public DateTime? TimeFlaggedUtc { get; set; }
        public TimeSpan? Duration { get; set; }
        public bool IsFeatured { get; set; }
        public uint AmountInvested { get; set; }
        public bool IsHotDeal { get; set; }
        public int TunerLevel { get; set; }
        public IList<AuctionDataBid> Bids { get; set; }
        public AuctionDataCar Car { get; set; }
        public int UserReportTotal { get; set; }
        public int UserReportCollectionId { get; set; }
        public AuctionReviewState ReportingState { get; set; }
        public bool IsCarRetrieved { get; set; }
        public bool IsPaymentCollected { get; set; }
        public short LiveryLayers { get; set; }
        public short NumberOfLiveryContributors { get; set; }
        public uint NextBidAmount { get; set; }
        public AuctionDataAuctionAction AllowedActions { get; set; }
        public uint TopBidAmount { get; set; }
        public ulong TopBidderXuid { get; set; }
        public int PainterLevel { get; set; }
        public int BidCount { get; set; }
    }
}
