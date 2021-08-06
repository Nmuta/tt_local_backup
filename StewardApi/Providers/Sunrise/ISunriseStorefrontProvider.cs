using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

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
        Task<IList<UGCItem>> SearchUGCItems(UGCType ugcType, UGCFilters filters);

        /// <summary>
        ///    Get player livery.
        /// </summary>
        Task<UGCItem> GetUGCLivery(Guid liveryId);

        /// <summary>
        ///    Get player photo.
        /// </summary>
        Task<UGCItem> GetUGCPhoto(Guid photoId);

        /// <summary>
        ///     Sets featured state of a UGC content item.
        /// </summary>
        Task SetUGCFeaturedStatus(Guid contentId, bool isFeatured, TimeSpan? featuredExpiry);
    }
}
