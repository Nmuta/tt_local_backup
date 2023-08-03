using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.Services.LiveOps.FH5_main.Generated.StorefrontManagementService;

#pragma warning disable VSTHRD200 // Use Async Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock
{
    /// <summary>
    ///     Interface proxy for <see cref="StorefrontManagementService"/>.
    /// </summary>
    public interface IStorefrontManagementService
    {
        /// <summary>Gets a specific livery.</summary>
        Task<GetUGCLiveryOutput> GetUGCLivery(Guid id);

        /// <summary>Gets a specific photo.</summary>
        Task<GetUGCPhotoOutput> GetUGCPhoto(Guid id);

        /// <summary>Gets a specific tune.</summary>
        Task<GetUGCTuneOutput> GetUGCTune(Guid id);

        /// <summary>Gets a specific layer group.</summary>
        Task<GetUGCLayerGroupOutput> GetUGCLayerGroup(Guid id);

        /// <summary>Gets base UGC data.</summary>
        Task<GetUGCObjectOutput> GetUGCObject(Guid id);

        /// <summary>Sets a UGC Geo Flag.</summary>
        /// <param name="id">The UGC ID.</param>
        /// <param name="geoFlags">Array of integers representing the flags that should be set after this call.</param>
        Task SetUGCGeoFlag(Guid id, int[] geoFlags);

        /// <summary>Report content with a reason. Reason should come from pegasus.</summary>
        Task ReportContentWithReason(Guid fileId, Guid reason);

        /// <summary>Generates a Sharecode for the given UGC ID.</summary>
        Task<GenerateShareCodeOutput> GenerateShareCode(Guid id);

        /// <summary>Sets hidden status for UGC item by ID.</summary>
        Task SetUGCVisibility(Guid id, bool shouldBeVisible);

        /// <summary>
        ///     Gets player UGC.
        /// </summary>
        Task<GetUGCForUserOutput> GetUGCForUser(ulong xuid, ForzaUGCContentType contentType, bool includeThumbnails, int maxResults, bool onlyT10Featured);

        /// <summary>Gets hidden UGC by xuid.</summary>
        Task<GetHiddenUGCByUserOutput> GetHiddenUGCByUser(ulong xuid, ForzaUGCContentType contentType, int maxResults);

        /// <summary>Gets curated UGC data.</summary>
        Task<GetCuratedUgcOutput> GetCuratedUgc(ForzaUGCContentType contentType, ForzaCurationMethod curationMethod, int maxResults);

        /// <summary>Updates Title and Description of a UGC item.</summary>
        Task SetTitleAndDescription(Guid id, string newTitle, string newDescription);
    }
}
