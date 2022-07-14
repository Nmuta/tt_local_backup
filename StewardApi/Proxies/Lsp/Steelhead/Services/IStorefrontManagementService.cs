﻿using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FM8.Generated;
using StorefrontManagementService = Turn10.Services.LiveOps.FM8.Generated.StorefrontManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    public interface IStorefrontManagementService
    {
        /// <summary>
        ///     Searchs public UGC.
        /// </summary>
        Task<StorefrontManagementService.SearchUGCOutput> SearchUGC(
            ForzaUGCSearchRequest searchRequest,
            ForzaUGCContentType contentType,
            bool includeThumbnails,
            int maxResults);

        /// <summary>
        ///     Gets livery.
        /// </summary>
        Task<StorefrontManagementService.GetUGCLiveryOutput> GetUGCLivery(
            Guid id);

        /// <summary>
        ///     Gets photo.
        /// </summary>
        Task<StorefrontManagementService.GetUGCPhotoOutput> GetUGCPhoto(
            Guid id);

        /// <summary>
        ///     Gets tune.
        /// </summary>
        Task<StorefrontManagementService.GetUGCTuneOutput> GetUGCTune(
            Guid id);

        /// <summary>
        ///     Sets featured status of UGC item.
        /// </summary>
        Task SetFeatured(
            Guid id,
            bool featured,
            DateTime featureEndDate,
            DateTime forceFeatureEndDate);
    }
}
