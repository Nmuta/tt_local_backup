using System;
using System.Data;
using System.Globalization;
using System.Text.RegularExpressions;
using Turn10.Data.Common;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Kusto)
#pragma warning disable CS1591 // XML Comments (POCO mapped from Kusto)
#pragma warning disable SA1516 // Blank Lines (POCO mapped from Kusto)

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a gift history.
    /// </summary>
    public sealed class AuctionHistoryEntry
    {
        public const int SingleRequestResultsLimit = 500;

        public DateTime TimeUtc { get; set; }
        public string Action { get; set; }
        public string AuctionId { get; set; }
        public ulong Xuid { get; set; }
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
        public ulong SellerXuid { get; set; }
        public ulong CarId { get; set; }
        public ulong CarMake { get; set; }
        public ulong CarYear { get; set; }
        public string CarVin { get; set; }
        public ulong BidAmount { get; set; }
        public ulong SpendAmount { get; set; }
        public ulong OpeningPrice { get; set; }
        public ulong BuyoutPrice { get; set; }

        /// <summary>
        ///     Makes a query for bid events that this model can read.
        /// </summary>
        public static string MakeBaseQuery(ulong xuid)
        {
            return $@"
let xuid = '{xuid}';
union
    (
        database('Prod Sunrise Services').Forza_WebServices_Auction_PlaceBid
        | summarize by Time=['time'], Action='Bid', AuctionId=auctionId, Xuid=System_HeaderXuid, Success=System_Success, System_StackTrace, BidAmount=bidAmount, SpendAmount=spendAmount
        | where Xuid == xuid
    ),
    (
        database('Prod Sunrise Services').Forza_WebServices_Auction_Create
        | summarize by Time=['time'], Action='Create', AuctionId=auctionId, Xuid=System_HeaderXuid, Success=System_Success, System_StackTrace
        | where Xuid == xuid
    ),
    (
        database('Prod Sunrise Services').Forza_WebServices_Auction_RetrieveCarForAuction
        | summarize by Time=['time'], Action='RetrieveCar', AuctionId=auctionId, Xuid=System_HeaderXuid, Success=System_Success, System_StackTrace
        | where Xuid == xuid
    ),
    (
        database('Prod Sunrise Services').Forza_WebServices_Auction_RetrievePaymentForAuctionSold
        | summarize by Time=['time'], Action='RetrievePaymentForSold', AuctionId=auctionId, Xuid=System_HeaderXuid, Success=System_Success, System_StackTrace
        | where Xuid == xuid
    ),
    (
        database('Prod Sunrise Services').Forza_WebServices_Auction_RetrievePaymentsForAuctionLost
        | summarize by Time=['time'], Action='RetrievePaymentForLost', AuctionId=auctionId, Xuid=System_HeaderXuid, Success=System_Success, System_StackTrace
        | where Xuid == xuid
    )
| where AuctionId <> ''
| project Time, Action, AuctionId, Xuid, Success, Message=extract('Message: ?(.*?)\r\n', 1, System_StackTrace), BidAmount, SpendAmount
| join kind=leftouter
    (
        database('Prod Sunrise Services').Forza_WebServices_Auction_Create
        | project AuctionId=auctionId, SellerXuid=System_HeaderXuid, OpeningPrice=openingPrice, BuyoutPrice=buyoutPrice, CarId=forzaCar_carId, CarMake=forzaCar_make, CarYear=forzaCar_year, CarVin=forzaCar_vin
        | where AuctionId <> ''
    ) on AuctionId
| project TimeUtc=Time, AuctionId, SellerXuid, CarId, CarMake, CarYear, CarVin, Action, BidAmount, SpendAmount, OpeningPrice, BuyoutPrice, IsSuccess=Success, ErrorMessage=Message
";
        }

        /// <summary>
        ///     Makes a query for bid events that this model can read.
        /// </summary>
        public static string MakeQuery(ulong xuid, DateTime? skipToken = null)
        {
            if (skipToken.HasValue)
            {
                return $@"
{MakeBaseQuery(xuid)}
| order by TimeUtc
| where TimeUtc < datetime({skipToken})
| take {SingleRequestResultsLimit}
";
            }

            return $@"
{MakeBaseQuery(xuid)}
| order by TimeUtc
| take {SingleRequestResultsLimit}
";
        }

        public static AuctionHistoryEntry FromQueryResult(IDataReader reader)
        {
            return new AuctionHistoryEntry
            {
                TimeUtc = reader.Get<DateTime>(nameof(TimeUtc)),
                Action = reader.Get<string>(nameof(Action)),
                AuctionId = reader.Get<string>(nameof(AuctionId)),
                SellerXuid = reader.Get<ulong>(nameof(SellerXuid)),
                CarId = reader.Get<ulong>(nameof(CarId)),
                CarMake = reader.Get<ulong>(nameof(CarMake)),
                CarYear = reader.Get<ulong>(nameof(CarYear)),
                CarVin = reader.Get<string>(nameof(CarVin)),
                BidAmount = reader.Get<ulong>(nameof(BidAmount)),
                SpendAmount = reader.Get<ulong>(nameof(SpendAmount)),
                OpeningPrice = reader.Get<ulong>(nameof(OpeningPrice)),
                BuyoutPrice = reader.Get<ulong>(nameof(BuyoutPrice)),
                IsSuccess = reader.Get<bool>(nameof(IsSuccess)),
                ErrorMessage = reader.Get<string>(nameof(ErrorMessage)),
            };
        }
    }
}
