using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint
{
    /// <summary>
    ///     The status of a bid on an auction. From LSP.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum AuctionDataBidStatus
    {
        Escrow = 0,
        WaitingForRetrievalByBidder = 1,
        WaitingForRetrievalByAuctionOwner = 2,
        Retrieved = 3,
        Cancelled = 4,
    }
}
