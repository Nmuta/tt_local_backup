using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FM8.Generated;
using AuctionManagementService = Turn10.Services.LiveOps.FM8.Generated.AuctionManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    /// <summary>
    ///     Manages auctions. Proxy for Client object.
    /// </summary>
    public interface IAuctionManagementService
    {
        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        Task<AuctionManagementService.SearchAuctionHouseOutput> SearchAuctionHouse(
            ForzaAuctionFilters filters);

        /// <summary>
        ///     Add cars to auction blocklist.
        /// </summary>
        Task AddToAuctionBlocklist(
            ForzaAuctionBlocklistEntry[] carsToBlock);

        /// <summary>
        ///     Gets the auction blocklist.
        /// </summary>
        Task<AuctionManagementService.GetAuctionBlocklistOutput> GetAuctionBlocklist(
            int maxResult);

        /// <summary>
        ///     Delete auction blocklist entries.
        /// </summary>
        Task DeleteAuctionBlocklistEntries(
            int[] carIds);

        /// <summary>
        ///     Gets data from single auction.
        /// </summary>
        Task<AuctionManagementService.GetAuctionDataOutput> GetAuctionData(
            Guid auctionId);

        /// <summary>
        ///     Deletes auctions based on their IDs.
        /// </summary>
        Task<AuctionManagementService.DeleteAuctionsOutput> DeleteAuctions(
            Guid[] auctionIds);
    }
}
