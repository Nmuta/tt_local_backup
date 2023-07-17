using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.Services.LiveOps.FM8.Generated.StorefrontManagementService;

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
        Task<SearchUGCOutput> SearchUGC(
            ForzaUGCSearchRequest searchRequest,
            ForzaUGCContentType contentType,
            bool includeThumbnails,
            int maxResults);

        /// <summary>
        ///     Gets livery.
        /// </summary>
        Task<GetUGCLiveryOutput> GetUGCLivery(
            Guid id);

        /// <summary>
        ///     Gets photo.
        /// </summary>
        Task<GetUGCPhotoOutput> GetUGCPhoto(
            Guid id);

        /// <summary>
        ///     Gets tune.
        /// </summary>
        Task<GetUGCTuneOutput> GetUGCTune(
            Guid id);

        /// <summary>
        ///     Sets featured status of UGC item.
        /// </summary>
        Task SetFeatured(
            Guid id,
            bool featured,
            DateTime featureEndDate,
            DateTime forceFeatureEndDate);

        /// <summary>
        ///     Sets UGC geo flag sttribute.
        /// </summary>
        Task SetUGCGeoFlag(Guid id, int[] geoFlags);

        /// <summary>
        ///     Gets player UGC.
        /// </summary>
        Task<GetUGCForUserOutput> GetUGCForUser(ulong xuid, ForzaUGCContentType contentType, bool includeThumbnails, int maxResults, bool onlyT10Featured);

        /// <summary>
        ///     Report content with a reason. Reason should come from pegasus.
        /// </summary>
        Task ReportContentWithReason(Guid fileId, Guid reason);

        /// <summary>Generates a Sharecode for the given UGC ID.</summary>
        Task<GenerateShareCodeOutput> GenerateShareCode(Guid id);

        /// <summary>Gets base UGC data.</summary>
        Task<GetUGCObjectOutput> GetUGCObject(Guid id);

        /// <summary>Gets curate UGC data.</summary>
        Task<GetCuratedUgcOutput> GetCuratedUgc(ForzaUGCContentType contentType, ForzaCurationMethod curationMethod, int maxResults);
    }
}
