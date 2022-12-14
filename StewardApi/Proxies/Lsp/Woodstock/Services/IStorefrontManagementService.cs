﻿using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Forza.WebServices.FH5_main.Generated.LiveOpsService;

#pragma warning disable VSTHRD200 // Use Async Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock
{
    public interface IStorefrontManagementService
    {
        /// <summary>Gets a specific livery.</summary>
        Task<StorefrontManagementService.GetUGCLiveryOutput> GetUGCLivery(Guid id);

        /// <summary>Gets a specific photo.</summary>
        Task<StorefrontManagementService.GetUGCPhotoOutput> GetUGCPhoto(Guid id);

        /// <summary>Gets a specific tune.</summary>
        Task<StorefrontManagementService.GetUGCTuneOutput> GetUGCTune(Guid id);

        /// <summary>Gets a specific layer group.</summary>
        Task<StorefrontManagementService.GetUGCLayerGroupOutput> GetUGCLayerGroup(Guid id);

        /// <summary>Gets base UGC data.</summary>
        Task<StorefrontManagementService.GetUGCObjectOutput> GetUGCObject(Guid id);

        /// <summary>Sets a UGC Geo Flag.</summary>
        /// <param name="geoFlags">Array of integers representing the flags that should be set after this call.</param>
        Task SetUGCGeoFlag(Guid id, int[] geoFlags);

        /// <summary>Report content with a reason. Reason should come from pegasus.</summary>
        Task ReportContentWithReason(Guid fileId, Guid reason);
    }
}
