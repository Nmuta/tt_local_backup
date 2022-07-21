using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Forza.UserGeneratedContent.FH5_main.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <summary>
    ///     Exposes methods for interacting with the Woodstock storefront.
    /// </summary>
    public interface IWoodstockStorefrontProvider
    {
        /// <summary>
        ///     Get a player's public and private UGC items.
        /// </summary>
        Task<IList<WoodstockUgcItem>> GetPlayerUgcContentAsync(
            ulong xuid,
            UgcType ugcType,
            string endpoint,
            bool includeThumbnails = false);

        /// <summary>
        ///     Search UGC items by UGC share-code.
        /// </summary>
        Task<IList<WoodstockUgcItem>> SearchUgcContentAsync(UgcType ugcType, ServicesLiveOps.ForzaUGCSearchRequest filters, string endpoint, bool includeThumbnails = false);

        /// <summary>
        ///    Get player livery.
        /// </summary>
        Task<WoodstockUgcLiveryItem> GetUgcLiveryAsync(Guid liveryId, string endpoint);

        /// <summary>
        ///    Get player photo.
        /// </summary>
        Task<WoodstockUgcItem> GetUgcPhotoAsync(Guid photoId, string endpoint);

        /// <summary>
        ///    Get player tune.
        /// </summary>
        Task<WoodstockUgcItem> GetUgcTuneAsync(Guid tuneId, string endpoint);

        /// <summary>
        ///    Get player event blueprint.
        /// </summary>
        Task<WoodstockUgcItem> GetUgcEventBlueprintAsync(Guid eventBlueprintId, string endpoint);

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
        ///     Deletes the given auction.
        /// </summary>
        Task<ServicesLiveOps.AuctionManagementService.DeleteAuctionsOutput> DeleteAuctionAsync(
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
