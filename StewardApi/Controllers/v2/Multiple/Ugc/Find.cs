using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

using FH5 = Forza.LiveOps.FH5_main.Generated;
using FH4 = Forza.LiveOps.FH4.Generated;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Microsoft.AspNetCore.Http;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Multiple.Ugc
{
    /// <summary>
    ///     Handles requests for Woodstock.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/multi/ugc/find")]
    [LogTagTitle(TitleLogTags.Woodstock | TitleLogTags.Sunrise)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags("UGC", "Multiple", "Woodstock", "Sunrise")]
    public class Find : V2ControllerBase
    {
        private readonly IWoodstockService fh5Service;
        private readonly ISunriseService fh4Service;
        private readonly IWoodstockStorefrontProvider storefrontProvider;
        private readonly IKustoProvider kustoProvider;

        public Find(IWoodstockService fh5Service, ISunriseService fh4Service, IWoodstockStorefrontProvider storefrontProvider, IKustoProvider kustoProvider)
        {
            this.fh5Service = fh5Service;
            this.fh4Service = fh4Service;
            this.storefrontProvider = storefrontProvider;
            this.kustoProvider = kustoProvider;
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
            var fh5Lookups = new[]
            {
                this.LookupFH5ShareCodeOrNullAsync(shareCodeOrId, FH5.ForzaUGCContentType.Livery),
                this.LookupFH5ShareCodeOrNullAsync(shareCodeOrId, FH5.ForzaUGCContentType.Tune),
                this.LookupFH5ShareCodeOrNullAsync(shareCodeOrId, FH5.ForzaUGCContentType.Photo),
                this.LookupFH5IdOrNullAsync(
                    shareCodeOrId,
                    FH5.ForzaUGCContentType.Livery,
                    (id) => this.fh5Service.GetPlayerLiveryAsync(id, this.WoodstockEndpoint.Value),
                    item => item.result.Metadata.ContentType == FH5.ForzaUGCContentType.Livery),
                this.LookupFH5IdOrNullAsync(
                    shareCodeOrId,
                    FH5.ForzaUGCContentType.Tune,
                    (id) => this.fh5Service.GetPlayerTuneAsync(id, this.WoodstockEndpoint.Value),
                    item => item.result.Metadata.ContentType == FH5.ForzaUGCContentType.Tune),
                this.LookupFH5IdOrNullAsync(
                    shareCodeOrId,
                    FH5.ForzaUGCContentType.Photo,
                    (id) => this.fh5Service.GetPlayerPhotoAsync(id, this.WoodstockEndpoint.Value),
                    item => item.result.Metadata.ContentType == FH5.ForzaUGCContentType.Photo),
            };

            var fh4Lookups = new[]
            {
                this.LookupFH4ShareCodeOrNullAsync(shareCodeOrId, FH4.ForzaUGCContentType.Livery),
                this.LookupFH4ShareCodeOrNullAsync(shareCodeOrId, FH4.ForzaUGCContentType.Tune),
                this.LookupFH4ShareCodeOrNullAsync(shareCodeOrId, FH4.ForzaUGCContentType.Photo),
                this.LookupFH4IdOrNullAsync(
                    shareCodeOrId,
                    FH4.ForzaUGCContentType.Livery,
                    (id) => this.fh4Service.GetPlayerLiveryAsync(id, this.SunriseEndpoint.Value),
                    item => item.result.Metadata.ContentType == FH4.ForzaUGCContentType.Livery),
                this.LookupFH4IdOrNullAsync(
                    shareCodeOrId,
                    FH4.ForzaUGCContentType.Tune,
                    (id) => this.fh4Service.GetPlayerTuneAsync(id, this.SunriseEndpoint.Value),
                    item => item.result.Metadata.ContentType == FH4.ForzaUGCContentType.Tune),
                this.LookupFH4IdOrNullAsync(
                    shareCodeOrId,
                    FH4.ForzaUGCContentType.Photo,
                    (id) => this.fh4Service.GetPlayerPhotoAsync(id, this.SunriseEndpoint.Value),
                    item => item.result.Metadata.ContentType == FH4.ForzaUGCContentType.Photo),
            };

            await Task.WhenAll(fh5Lookups).ConfigureAwait(true);
            await Task.WhenAll(fh4Lookups).ConfigureAwait(true);
            var foundInFH5 = fh5Lookups.Select(fh5Lookup => fh5Lookup.GetAwaiter().GetResult()).Where(v => v != null).Select(v => v.Value).ToList();
            var foundInFH4 = fh4Lookups.Select(fh4Lookup => fh4Lookup.GetAwaiter().GetResult()).Where(v => v != null).Select(v => v.Value).ToList();

            return this.Ok(new OutputModel
            {
                ShareCodeOrId = shareCodeOrId,
                Fh5 = foundInFH5,
                Fh4 = foundInFH4,
            });
        }

        private async Task<FH5.ForzaUGCContentType?> LookupFH5IdOrNullAsync<T>(string shareCodeOrId, FH5.ForzaUGCContentType type, Func<Guid, Task<T>> actionAsync, Func<T, bool> validator)
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
                        return null;
                    }
                }
                catch
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

        private async Task<FH4.ForzaUGCContentType?> LookupFH4IdOrNullAsync<T>(string shareCodeOrId, FH4.ForzaUGCContentType type, Func<Guid, Task<T>> actionAsync, Func<T, bool> validator)
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
                        return null;
                    }
                }
                catch
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

        private async Task<FH5.ForzaUGCContentType?> LookupFH5ShareCodeOrNullAsync(string shareCodeOrId, FH5.ForzaUGCContentType type)
        {
            var ugcList = await this.fh5Service.SearchUgcContentAsync(
                new FH5.ForzaUGCSearchRequest { ShareCode = shareCodeOrId, Xuid = ulong.MaxValue },
                type,
                this.WoodstockEndpoint.Value,
                includeThumbnails: true).ConfigureAwait(false);

            var singleUgc = ugcList.result.FirstOrDefault();
            if (singleUgc == null) { return null; }
            return type;
        }

        private async Task<FH4.ForzaUGCContentType?> LookupFH4ShareCodeOrNullAsync(string shareCode, FH4.ForzaUGCContentType type)
        {
            var ugcList = await this.fh4Service.SearchUgcContentAsync(
                new FH4.ForzaUGCSearchRequest { ShareCode = shareCode, Xuid = ulong.MaxValue },
                type,
                this.SunriseEndpoint.Value,
                includeThumbnails: true).ConfigureAwait(false);

            var singleUgc = ugcList.result.FirstOrDefault();
            if (singleUgc == null) { return null; }
            return type;
        }

        private class OutputModel
        {
            public string ShareCodeOrId { get; set; }

            [JsonProperty(ItemConverterType = typeof(StringEnumConverter))]
            public IList<FH5.ForzaUGCContentType> Fh5 { get; set; }

            [JsonProperty(ItemConverterType = typeof(StringEnumConverter))]
            public IList<FH4.ForzaUGCContentType> Fh4 { get; set; }
        }
    }
}
