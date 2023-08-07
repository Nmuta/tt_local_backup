using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
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
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Details, Topic.Ugc)]
    public class LookupController : V2ControllerBase
    {
        private readonly IWoodstockStorefrontProvider storefrontProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LookupController"/> class.
        /// </summary>
        public LookupController(IWoodstockStorefrontProvider storefrontProvider)
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
            var thumbnailLookups = new List<Task<WoodstockUgcItem>>();

            foreach (var id in ugcIds)
            {
                thumbnailLookups.Add(this.storefrontProvider.GetUgcPhotoAsync(id, this.WoodstockEndpoint.Value));
            }

            await Task.WhenAll(thumbnailLookups).ConfigureAwait(true);

            foreach (var query in thumbnailLookups)
            {
                var lookupResult = query.GetAwaiter().GetResult();
                var thumbnailResult = new ThumbnailLookupOutput
                { Id = lookupResult.Id, Thumbnail = lookupResult.ThumbnailOneImageBase64 };

                thumbnails.Add(thumbnailResult);
            }

            return this.Ok(thumbnails);
        }
    }
}
