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
    ///     A bid on an auction. From LSP.
    /// </summary>
    public class AuctionDataBid
    {
        public ulong Xuid { get; set; }
        public Guid ProfileId { get; set; }
        public uint Amount { get; set; }
        public DateTime DateUtc { get; set; }
        public AuctionDataBidStatus Status { get; set; }
        public bool IsTopBid { get; set; }
    }
}
