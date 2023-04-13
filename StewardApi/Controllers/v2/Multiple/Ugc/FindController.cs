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
            var fh5StorefrontService = this.WoodstockServices.Value.StorefrontManagementService;
            var fm8StorefrontService = this.SteelheadServices.Value.StorefrontManagementService;
            var fm8Lookups = new[]
            {
                this.LookupFM8ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFM8.ForzaUGCContentType.Livery),
                this.LookupFM8ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFM8.ForzaUGCContentType.TuneBlob),
                this.LookupFM8ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFM8.ForzaUGCContentType.Photo),
                this.LookupIdOrNullAsync<ServicesLiveOpsFM8.ForzaUGCContentType?, ServicesLiveOpsFM8.StorefrontManagementService.GetUGCLiveryOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFM8.ForzaUGCContentType.Livery,
                    (id) => fm8StorefrontService.GetUGCLivery(id),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFM8.ForzaUGCContentType.Livery),
                this.LookupIdOrNullAsync<ServicesLiveOpsFM8.ForzaUGCContentType?, ServicesLiveOpsFM8.StorefrontManagementService.GetUGCTuneOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFM8.ForzaUGCContentType.TuneBlob,
                    (id) => fm8StorefrontService.GetUGCTune(id),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFM8.ForzaUGCContentType.TuneBlob),
                this.LookupIdOrNullAsync<ServicesLiveOpsFM8.ForzaUGCContentType?, ServicesLiveOpsFM8.StorefrontManagementService.GetUGCPhotoOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFM8.ForzaUGCContentType.Photo,
                    (id) => fm8StorefrontService.GetUGCPhoto(id),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFM8.ForzaUGCContentType.Photo),
            };

            var fh5Lookups = new[]
            {
                this.LookupFH5ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH5.ForzaUGCContentType.Livery),
                this.LookupFH5ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH5.ForzaUGCContentType.Tune),
                this.LookupFH5ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH5.ForzaUGCContentType.Photo),
                this.LookupFH5ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH5.ForzaUGCContentType.EventBlueprint),
                this.LookupFH5ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH5.ForzaUGCContentType.CommunityChallenge),
                this.LookupFH5ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH5.ForzaUGCContentType.Layergroup),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH5.ForzaUGCContentType?, ServicesLiveOpsFH5.StorefrontManagementService.GetUGCLiveryOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH5.ForzaUGCContentType.Livery,
                    (id) => this.fh5Service.GetPlayerLiveryAsync(id, this.WoodstockEndpoint.Value),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFH5.ForzaUGCContentType.Livery),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH5.ForzaUGCContentType?, ServicesLiveOpsFH5.StorefrontManagementService.GetUGCTuneOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH5.ForzaUGCContentType.Tune,
                    (id) => this.fh5Service.GetPlayerTuneAsync(id, this.WoodstockEndpoint.Value),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFH5.ForzaUGCContentType.Tune),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH5.ForzaUGCContentType?, ServicesLiveOpsFH5.StorefrontManagementService.GetUGCPhotoOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH5.ForzaUGCContentType.Photo,
                    (id) => this.fh5Service.GetPlayerPhotoAsync(id, this.WoodstockEndpoint.Value),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFH5.ForzaUGCContentType.Photo),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH5.ForzaUGCContentType?, SubmoduleFH5.LiveOpsService.GetUGCEventBlueprintOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH5.ForzaUGCContentType.EventBlueprint,
                    (id) => this.fh5Service.GetEventBlueprintAsync(id, this.WoodstockEndpoint.Value),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFH5.ForzaUGCContentType.EventBlueprint),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH5.ForzaUGCContentType?, SubmoduleFH5.LiveOpsService.GetUGCCommunityChallengeOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH5.ForzaUGCContentType.CommunityChallenge,
                    (id) => this.fh5Service.GetCommunityChallengeAsync(id, this.WoodstockEndpoint.Value),
                    item => item.communityChallengeData.Metadata.ContentType == ServicesLiveOpsFH5.ForzaUGCContentType.CommunityChallenge),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH5.ForzaUGCContentType?, T10SubmoduleFH5.StorefrontManagementService.GetUGCLayerGroupOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH5.ForzaUGCContentType.Layergroup,
                    (id) => fh5StorefrontService.GetUGCLayerGroup(id),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFH5.ForzaUGCContentType.Layergroup),
            };

            var fh4Lookups = new[]
            {
                this.LookupFH4ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH4.ForzaUGCContentType.Livery),
                this.LookupFH4ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH4.ForzaUGCContentType.Layergroup),
                this.LookupFH4ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH4.ForzaUGCContentType.Tune),
                this.LookupFH4ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH4.ForzaUGCContentType.Photo),
                this.LookupFH4ShareCodeOrNullAsync(shareCodeOrId, ServicesLiveOpsFH4.ForzaUGCContentType.EventBlueprint),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH4.ForzaUGCContentType?, ServicesLiveOpsFH4.StorefrontManagementService.GetUGCLiveryOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH4.ForzaUGCContentType.Livery,
                    (id) => this.fh4Service.GetPlayerLiveryAsync(id, this.SunriseEndpoint.Value),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFH4.ForzaUGCContentType.Livery),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH4.ForzaUGCContentType?, ServicesLiveOpsFH4.StorefrontManagementService.GetUGCObjectOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH4.ForzaUGCContentType.Layergroup,
                    (id) => this.fh4Service.GetPlayerUgcObjectAsync(id, this.SunriseEndpoint.Value),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFH4.ForzaUGCContentType.Layergroup),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH4.ForzaUGCContentType?, ServicesLiveOpsFH4.StorefrontManagementService.GetUGCTuneOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH4.ForzaUGCContentType.Tune,
                    (id) => this.fh4Service.GetPlayerTuneAsync(id, this.SunriseEndpoint.Value),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFH4.ForzaUGCContentType.Tune),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH4.ForzaUGCContentType?, ServicesLiveOpsFH4.StorefrontManagementService.GetUGCPhotoOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH4.ForzaUGCContentType.Photo,
                    (id) => this.fh4Service.GetPlayerPhotoAsync(id, this.SunriseEndpoint.Value),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFH4.ForzaUGCContentType.Photo),
                this.LookupIdOrNullAsync<ServicesLiveOpsFH4.ForzaUGCContentType?, ServicesLiveOpsFH4.StorefrontManagementService.GetUGCObjectOutput>(
                    shareCodeOrId,
                    ServicesLiveOpsFH4.ForzaUGCContentType.EventBlueprint,
                    (id) => this.fh4Service.GetPlayerUgcObjectAsync(id, this.SunriseEndpoint.Value),
                    item => item.result.Metadata.ContentType == ServicesLiveOpsFH4.ForzaUGCContentType.EventBlueprint),
            };

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

#nullable enable
        private async Task<TUgcContentType?> LookupIdOrNullAsync<TUgcContentType, TOutput>(string shareCodeOrId, TUgcContentType type, Func<Guid, Task<TOutput>> actionAsync, Func<TOutput, bool> validator)
        {
            if (Guid.TryParse(shareCodeOrId, out var id))
            {
                try
                {
                    var result = await actionAsync(id).ConfigureAwait(true);
                    if (result != null && validator(result))
                    {
                        return type;
                    }
                    else
                    {
                        return default(TUgcContentType);
                    }
                }
                catch
                {
                    return default(TUgcContentType);
                }
            }
            else
            {
                return default(TUgcContentType);
            }
        }

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
