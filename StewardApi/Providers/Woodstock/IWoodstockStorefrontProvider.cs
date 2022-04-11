using Forza.UserGeneratedContent.FH5_main.Generated;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using static Forza.LiveOps.FH5_main.Generated.AuctionManagementService;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <summary>
    ///     Exposes methods for interacting with the Woodstock storefront.
    /// </summary>
    public interface IWoodstockStorefrontProvider
    {
        /// <summary>
        ///     Search UGC items.
        /// </summary>
        Task<IList<UgcItem>> SearchUgcContentAsync(UGCType ugcType, UGCFilters filters, string endpoint, bool includeThumbnails = false);

        /// <summary>
        ///    Get player livery.
        /// </summary>
        Task<UgcItem> GetUGCLiveryAsync(Guid liveryId, string endpoint);

        /// <summary>
        ///    Get player photo.
        /// </summary>
        Task<UgcItem> GetUGCPhotoAsync(Guid photoId, string endpoint);

        /// <summary>
        ///    Get player tune.
        /// </summary>
        Task<UgcItem> GetUGCTuneAsync(Guid tuneId, string endpoint);

        /// <summary>
        ///     Sets featured state of a UGC content item.
        /// </summary>
        Task SetUGCFeaturedStatusAsync(Guid contentId, bool isFeatured, TimeSpan? featuredExpiry, string endpoint);

        /// <summary>
        ///     Gets comprehensive data about an auction.
        /// </summary>
        Task<AuctionData> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint);

        /// <summary>
        ///     Deletes the given auction.
        /// </summary>
        Task<DeleteAuctionsOutput> DeleteAuctionAsync(
            Guid auctionId,
            string endpoint);

        /// <summary>
        ///     Gets hidden UGC of a player.
        /// </summary>
        Task<IList<HideableUgc>> GetHiddenUGCForUserAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Hides UGC.
        /// </summary>
        Task HideUGCAsync(
            Guid ugcId,
            string endpoint);

        /// <summary>
        ///     Unhides a player's UGC.
        /// </summary>
        Task UnhideUGCAsync(
            ulong xuid,
            Guid ugcId,
            FileType fileType,
            string endpoint);
    }
}
