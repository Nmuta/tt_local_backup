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
        /// <summary>
        ///     Gets livery.
        /// </summary>
        Task<StorefrontManagementService.GetUGCLiveryOutput> GetUGCLivery(
            Guid id);

        Task SetUGCGeoFlag(Guid id, int[] geoFlags);
    }
}
