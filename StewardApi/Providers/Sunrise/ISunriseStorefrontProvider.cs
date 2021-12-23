using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with the Sunrise storefront.
    /// </summary>
    public interface ISunriseStorefrontProvider
    {
        /// <summary>
        ///     Search UGC items.
        /// </summary>
        Task<IList<UgcItem>> SearchUgcContentAsync(UGCType ugcType, UGCFilters filters, string endpoint);

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
        ///     Gets hidden UGC of a player.
        /// </summary>
        Task<IList<HideableUgc>> GetHiddenUGCForUserAsync(ulong xuid, string endpoint);
    }
}
