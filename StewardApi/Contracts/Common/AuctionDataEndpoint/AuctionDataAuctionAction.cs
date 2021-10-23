using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
#pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)
#pragma warning disable CA1714 // Flags enums should have plural names (From LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint
{
    /// <summary>
    ///     The type of action on an auction. From LSP.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    [System.Flags]
    public enum AuctionDataAuctionAction
    {
        None = 0,
        Bid = 1,
        Buyout = 2,
        ResolveWon = 4,
        ResolveFailedAuction = 8,
        Restart = 16,
        Cancel = 32,
        Report = 64,
        RemoveBannedItem = 128,
        ReceiveMoneyAuctionOutbid = 256,
        ReceiveMoneyAuctionSold = 512
    }
}
