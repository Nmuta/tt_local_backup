using Forza.UserGeneratedContent.FH4.Generated;
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
        Task<IList<UgcItem>> SearchUgcContentAsync(UgcType ugcType, UgcFilters filters, string endpoint, bool includeThumbnails = false);

        /// <summary>
        ///    Get player livery.
        /// </summary>
        Task<UgcItem> GetUgcLiveryAsync(Guid liveryId, string endpoint);

        /// <summary>
        ///    Get player photo.
        /// </summary>
        Task<UgcItem> GetUgcPhotoAsync(Guid photoId, string endpoint);

        /// <summary>
        ///    Get player tune.
        /// </summary>
        Task<UgcItem> GetUgcTuneAsync(Guid tuneId, string endpoint);

        /// <summary>
        ///     Sets featured state of a UGC content item.
        /// </summary>
        Task SetUgcFeaturedStatusAsync(Guid contentId, bool isFeatured, TimeSpan? featuredExpiry, string endpoint);

        /// <summary>
        ///     Gets comprehensive data about an auction.
        /// </summary>
        Task<AuctionData> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint);

        /// <summary>
        ///     Gets hidden UGC of a player.
        /// </summary>
        Task<IList<HideableUgc>> GetHiddenUgcForUserAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Hides UGC.
        /// </summary>
        Task HideUgcAsync(
            Guid ugcId,
            string endpoint);

        /// <summary>
        ///     Unhides a player's UGC.
        /// </summary>
        Task UnhideUgcAsync(
            ulong xuid,
            Guid ugcId,
            FileType fileType,
            string endpoint);
    }
}
