using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.Services.LiveOps.FH5_main.Generated.AuctionManagementService;

#pragma warning disable VSTHRD200 // Use Async Suffix

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services
{
    /// <summary>
    ///     Proxy interface for <see cref="AuctionManagementService"/>.
    /// </summary>
    public interface IAuctionManagementService
    {
        /// <summary>
        ///     Create a single auction.
        /// </summary>
        Task<CreateAuctionOutput> CreateAuction(int carId, uint openingPrice, uint buyoutPrice, long durationInMS, ulong seller, Guid liveryFileId, Guid tuneFileId);

        /// <summary>
        ///     Create bulk auctions.
        /// </summary>
        Task<CreateBulkAuctionsOutput> CreateBulkAuctions(ulong seller, bool oneOfEveryCar, int numberOfRandomCars, int timeInMinutes);
    }
}
