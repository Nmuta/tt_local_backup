using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Rest;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using static System.Net.Mime.MediaTypeNames;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using FH4UGCContentType = Forza.LiveOps.FH4.Generated.ForzaUGCContentType;
using FH5UGCContentType = Turn10.Services.LiveOps.FH5_main.Generated.ForzaUGCContentType;
using FM8UGCContentType = Turn10.Services.LiveOps.FM8.Generated.ForzaUGCContentType;
using ServicesLiveOpsFH4 = Forza.LiveOps.FH4.Generated;
using ServicesLiveOpsFH5 = Turn10.Services.LiveOps.FH5_main.Generated;
using ServicesLiveOpsFM8 = Turn10.Services.LiveOps.FM8.Generated;
using SubmoduleFH5 = Forza.WebServices.FH5_main.Generated;
using T10SubmoduleFH5 = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Multiple.Ugc
{
    /// <summary>
    ///     Handles requests for Woodstock.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/multi/ugc/find")]
    [LogTagTitle(TitleLogTags.Woodstock | TitleLogTags.Sunrise)]
    [Authorize]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Topic.Ugc, Title.Multiple, Title.Woodstock, Title.Sunrise)]
    public class FindController : V2ControllerBase
    {
        private readonly IWoodstockService fh5Service;
        private readonly ISunriseService fh4Service;
        private readonly ILoggingService loggingService;

        private readonly IList<FH4UGCContentType> fh4SupportedTypes = new List<FH4UGCContentType> { FH4UGCContentType.Livery, FH4UGCContentType.Layergroup, FH4UGCContentType.Tune, FH4UGCContentType.Photo, FH4UGCContentType.EventBlueprint };
        private readonly IList<FH5UGCContentType> fh5SupportedTypes = new List<FH5UGCContentType> { FH5UGCContentType.Livery, FH5UGCContentType.Layergroup, FH5UGCContentType.Tune, FH5UGCContentType.Photo, FH5UGCContentType.EventBlueprint, FH5UGCContentType.CommunityChallenge };
        private readonly IList<FM8UGCContentType> fm8SupportedTypes = new List<FM8UGCContentType> { FM8UGCContentType.Livery, FM8UGCContentType.TuneBlob, FM8UGCContentType.Photo };

        /// <summary>
        ///     Initializes a new instance of the <see cref="FindController"/> class.
        /// </summary>
        public FindController(IWoodstockService fh5Service, ISunriseService fh4Service, ILoggingService loggingService)
        {
            this.fh5Service = fh5Service;
            this.fh4Service = fh4Service;
            this.loggingService = loggingService;
        }

        /// <summary>
        ///     Gets player UGC items.
        /// </summary>
        [HttpGet("{shareCodeOrId}")]
        [SwaggerResponse(200, type: typeof(OutputModel))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> Get(string shareCodeOrId)
        {
            var fh4StorefrontService = this.SunriseServices.Value.StorefrontManagementService;
            var fh5StorefrontService = this.WoodstockServices.Value.StorefrontManagementService;
            var fm8StorefrontService = this.SteelheadServices.Value.StorefrontManagementService;

            // If it parses to Guid, it's a UGC ID, else it's a sharecode
            if (Guid.TryParse(shareCodeOrId, out var ugcId))
            {
                FH4UGCContentType? fh4UgcType = null;
                FH5UGCContentType? fh5UgcType = null;
                FM8UGCContentType? fm8UgcType = null;

                try
                {
                    var fh4UgcContext = await fh4StorefrontService.GetUGCObject(ugcId).ConfigureAwait(true);
                    fh4UgcType = fh4UgcContext.result.Metadata.ContentType;
                    if (!this.fh4SupportedTypes.Contains(fh4UgcType.Value))
                    {
                        fh4UgcType = null;
                    }
                }
                catch { /* Do nothing */ }
                try
                {
                    var fh5UgcContext = await fh5StorefrontService.GetUGCObject(ugcId).ConfigureAwait(true);
                    fh5UgcType = fh5UgcContext.result.Metadata.ContentType;
                    if (!this.fh5SupportedTypes.Contains(fh5UgcType.Value))
                    {
                        fh5UgcType = null;
                    }
                }
                catch { /* Do nothing */ }

                try
                {
                    var fm8UgcContext = await fm8StorefrontService.GetUGCObject(ugcId).ConfigureAwait(true);
                    fm8UgcType = fm8UgcContext.result.Metadata.ContentType;
                    if (!this.fm8SupportedTypes.Contains(fm8UgcType.Value))
                    {
                        fm8UgcType = null;
                    }
                }
                catch { /* Do nothing */ }

                return this.Ok(new OutputModel
                {
                    ShareCodeOrId = shareCodeOrId,
                    Fm8 = fm8UgcType.HasValue ? new List<UgcType> { Enum.Parse<UgcType>(fm8UgcType.Value.ToString(), true) } : new List<UgcType>(),
                    Fh5 = fh5UgcType.HasValue ? new List<UgcType> { Enum.Parse<UgcType>(fh5UgcType.Value.ToString(), true) } : new List<UgcType>(),
                    Fh4 = fh4UgcType.HasValue ? new List<UgcType> { Enum.Parse<UgcType>(fh4UgcType.Value.ToString(), true) } : new List<UgcType>(),
                });
            }
            else
            {
                var fm8Lookups = this.fm8SupportedTypes.Select(contentType => this.LookupFM8ShareCodeOrNullAsync(shareCodeOrId, contentType)).ToArray();
                var fh5Lookups = this.fh5SupportedTypes.Select(contentType => this.LookupFH5ShareCodeOrNullAsync(shareCodeOrId, contentType)).ToArray();
                var fh4Lookups = this.fh4SupportedTypes.Select(contentType => this.LookupFH4ShareCodeOrNullAsync(shareCodeOrId, contentType)).ToArray();

                await Task.WhenAll(fm8Lookups).ConfigureAwait(true);
                await Task.WhenAll(fh5Lookups).ConfigureAwait(true);
                await Task.WhenAll(fh4Lookups).ConfigureAwait(true);

                var foundInFM8 = fm8Lookups
                    .Select(fm8Lookup => fm8Lookup.GetAwaiter().GetResult())
                    .Where(v => v != null)
                    .Select(v => Enum.Parse<UgcType>(v.Value.ToString(), true))
                    .ToList();
                var foundInFH5 = fh5Lookups
                    .Select(fh5Lookup => fh5Lookup.GetAwaiter().GetResult())
                    .Where(v => v != null)
                    .Select(v => Enum.Parse<UgcType>(v.Value.ToString(), true))
                    .ToList();
                var foundInFH4 = fh4Lookups
                    .Select(fh4Lookup => fh4Lookup.GetAwaiter().GetResult())
                    .Where(v => v != null)
                    .Select(v => Enum.Parse<UgcType>(v.Value.ToString(), true))
                    .ToList();

                return this.Ok(new OutputModel
                {
                    ShareCodeOrId = shareCodeOrId,
                    Fm8 = foundInFM8,
                    Fh5 = foundInFH5,
                    Fh4 = foundInFH4,
                });
            }
        }

#nullable enable
        private async Task<ServicesLiveOpsFM8.ForzaUGCContentType?> LookupFM8ShareCodeOrNullAsync(string shareCodeOrId, ServicesLiveOpsFM8.ForzaUGCContentType type)
        {
            try
            {
                var ugcList = await this.SteelheadServices.Value.StorefrontManagementService.SearchUGC(
                    new ServicesLiveOpsFM8.ForzaUGCSearchRequest { ShareCode = shareCodeOrId, Xuid = ulong.MaxValue, CarId = -1, KeywordIdOne = -1, KeywordIdTwo = -1, ShowBothUnfeaturedAndFeatured = true },
                    type,
                    includeThumbnails: true,
                    1).ConfigureAwait(false);

                var singleUgc = ugcList.result.FirstOrDefault();
                if (singleUgc == null) { return null; }
                return type;
            }
            catch (Exception ex)
            {
                this.loggingService.LogException(new AppInsightsException($"Lookup failed for FM8 UGC. (type: {type}) (UGC ID / Sharecode: {shareCodeOrId})", ex));
                return null;
            }
        }

        private async Task<ServicesLiveOpsFH5.ForzaUGCContentType?> LookupFH5ShareCodeOrNullAsync(string shareCodeOrId, ServicesLiveOpsFH5.ForzaUGCContentType type)
        {
            try
            {
                var ugcList = await this.fh5Service.SearchUgcContentAsync(
                    new ServicesLiveOpsFH5.ForzaUGCSearchRequest { ShareCode = shareCodeOrId, Xuid = ulong.MaxValue, CarId = -1, KeywordIdOne = -1, KeywordIdTwo = -1, ShowBothUnfeaturedAndFeatured = true },
                    type,
                    this.WoodstockEndpoint.Value,
                    includeThumbnails: true).ConfigureAwait(false);

                var singleUgc = ugcList.result.FirstOrDefault();
                if (singleUgc == null) { return null; }
                return type;
            }
            catch (Exception ex)
            {
                this.loggingService.LogException(new AppInsightsException($"Lookup failed for FH5 UGC. (type: {type}) (UGC ID / Sharecode: {shareCodeOrId})", ex));
                return null;
            }
        }

        private async Task<ServicesLiveOpsFH4.ForzaUGCContentType?> LookupFH4ShareCodeOrNullAsync(string shareCode, ServicesLiveOpsFH4.ForzaUGCContentType type)
        {
            try
            {
                var ugcList = await this.fh4Service.SearchUgcContentAsync(
                    new ServicesLiveOpsFH4.ForzaUGCSearchRequest { ShareCode = shareCode, Xuid = ulong.MaxValue },
                    type,
                    this.SunriseEndpoint.Value,
                    includeThumbnails: true).ConfigureAwait(false);

                var singleUgc = ugcList.result.FirstOrDefault();
                if (singleUgc == null) { return null; }
                return type;
            }
            catch (Exception ex)
            {
                this.loggingService.LogException(new AppInsightsException($"Lookup failed for FH4 UGC. (type: {type}) (Share Code: {shareCode})", ex));
                return null;
            }
        }
#nullable disable

        private class OutputModel
        {
            public string ShareCodeOrId { get; set; }

            [JsonProperty(ItemConverterType = typeof(StringEnumConverter))]
            public IList<UgcType> Fm8 { get; set; }

            [JsonProperty(ItemConverterType = typeof(StringEnumConverter))]
            public IList<UgcType> Fh5 { get; set; }

            [JsonProperty(ItemConverterType = typeof(StringEnumConverter))]
            public IList<UgcType> Fh4 { get; set; }
        }
    }
}
