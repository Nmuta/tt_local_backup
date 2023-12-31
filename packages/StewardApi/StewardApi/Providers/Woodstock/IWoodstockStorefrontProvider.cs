﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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
        [Obsolete("Use proxies")]
        Task<WoodstockUgcLiveryItem> GetUgcLiveryAsync(Guid liveryId, string endpoint);

        /// <summary>
        ///    Get player photo.
        /// </summary>
        [Obsolete("Use proxies")]
        Task<WoodstockUgcItem> GetUgcPhotoAsync(Guid photoId, string endpoint);

        /// <summary>
        ///    Get player tune.
        /// </summary>
        [Obsolete("Use proxies")]
        Task<WoodstockUgcItem> GetUgcTuneAsync(Guid tuneId, string endpoint);

        /// <summary>
        ///    Get player event blueprint.
        /// </summary>
        [Obsolete("Use proxies")]
        Task<WoodstockUgcItem> GetUgcEventBlueprintAsync(Guid eventBlueprintId, string endpoint);

        /// <summary>
        ///    Get community challenege event.
        /// </summary>
        [Obsolete("Use proxies")]
        Task<UgcItem> GetUgcCommunityChallengeAsync(Guid communityChallengeId, string endpoint);

        /// <summary>
        ///     Sets featured state of a UGC content item.
        /// </summary>
        Task SetUgcFeaturedStatusAsync(Guid contentId, bool isFeatured, TimeSpan? featuredExpiry, TimeSpan? forceFeaturedExpiry, string endpoint);

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
    }
}
