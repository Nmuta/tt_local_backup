using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Ugc
{
    /// <summary>
    ///     Handles requests for Woodstock.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/ugc/lookup")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.HorizonDesigner,
        UserRole.MotorsportDesigner,
        UserRole.MediaTeam)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock, Target.Details, Topic.Ugc)]
    public class WoodstockUgcLookup : V2ControllerBase
    {
        private readonly IWoodstockStorefrontProvider storefrontProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockUgcLookup"/> class.
        /// </summary>
        public WoodstockUgcLookup(IWoodstockStorefrontProvider storefrontProvider)
        {
            storefrontProvider.ShouldNotBeNull(nameof(storefrontProvider));

            this.storefrontProvider = storefrontProvider;
        }

        /// <summary>
        ///    Search UGC items.
        /// </summary>
        [HttpPost("photos/thumbnails")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> Get([FromBody] List<Guid> ugcIds)
        {
            var thumbnails = new List<ThumbnailLookupOutput>();
            var thumbnailLookups = new List<Task<UgcItem>>();

            foreach (var id in ugcIds)
            {
                thumbnailLookups.Add(this.storefrontProvider.GetUgcPhotoAsync(id, this.WoodstockEndpoint.Value));
            }

            await Task.WhenAll(thumbnailLookups).ConfigureAwait(true);

            foreach (var query in thumbnailLookups)
            {
                var lookupResult = query.GetAwaiter().GetResult();
                var thumbnailResult = new ThumbnailLookupOutput
                { Id = lookupResult.Id, Thumbnail = lookupResult.ThumbnailOneImageBase64};

                thumbnails.Add(thumbnailResult);
            }

            return this.Ok(thumbnails);
        }
    }
}
