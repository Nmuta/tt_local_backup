using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Ugc
{
    /// <summary>
    ///     Handles requests for Steelhead Ugc edit.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/ugc/{ugcId}/edit")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Details, Topic.Ugc)]
    public class EditController : V2SteelheadControllerBase
    {
        /// <summary>
        ///    Edit a UGC item.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Update | ActionAreaLogTags.Ugc)]
        [Authorize(Policy = UserAttributeValues.EditUgc)]
        public async Task<IActionResult> EditUgcTitleAndDescription(string ugcId, [FromBody] UgcEditInput ugcEditInput)
        {
            var parsedUgcId = ugcId.TryParseGuidElseThrow(nameof(ugcId));
            ugcEditInput.ShouldNotBeNull(nameof(ugcEditInput));

            await this.Services.StorefrontManagementService.SetTitleAndDescription(parsedUgcId, ugcEditInput.Title, ugcEditInput.Description).ConfigureAwait(true);
            return this.Ok();
        }

        /// <summary>
        ///    Edit a UGC item stats.
        /// </summary>
        [HttpPost("stats")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Update | ActionAreaLogTags.Ugc)]
        [Authorize(Policy = UserAttributeValues.EditUgc)]
        public async Task<IActionResult> EditUgcStats(string ugcId, [FromBody] UgcEditStatsInput ugcEditStatsInput)
        {
            var parsedUgcId = ugcId.TryParseGuidElseThrow(nameof(ugcId));
            ugcEditStatsInput.ShouldNotBeNull(nameof(ugcEditStatsInput));
            ugcEditStatsInput.Disliked.ShouldBeGreaterThanValue(-1);
            ugcEditStatsInput.Downloaded.ShouldBeGreaterThanValue(-1);
            ugcEditStatsInput.Liked.ShouldBeGreaterThanValue(-1);
            ugcEditStatsInput.Used.ShouldBeGreaterThanValue(-1);

            var ugcStatsParameters = new ForzaIncrementUGCStatsParameters[]
            {
                new ForzaIncrementUGCStatsParameters()
                {
                    Count = (uint)ugcEditStatsInput.Downloaded,
                    StatType = ForzaUGCPropertyType.Downloaded,
                },
                new ForzaIncrementUGCStatsParameters()
                {
                    Count = (uint)ugcEditStatsInput.Liked,
                    StatType = ForzaUGCPropertyType.Liked,
                },
                new ForzaIncrementUGCStatsParameters()
                {
                    Count = (uint)ugcEditStatsInput.Disliked,
                    StatType = ForzaUGCPropertyType.Disliked,
                },
                new ForzaIncrementUGCStatsParameters()
                {
                    Count = (uint)ugcEditStatsInput.Used,
                    StatType = ForzaUGCPropertyType.Used,
                },
            };

            await this.Services.StorefrontManagementService.IncrementUGCStats(parsedUgcId, ugcStatsParameters).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
