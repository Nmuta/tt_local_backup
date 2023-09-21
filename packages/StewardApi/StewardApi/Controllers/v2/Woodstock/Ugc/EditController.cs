using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Ugc
{
    /// <summary>
    ///     Handles requests for Woodstock Ugc edit.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/ugc/{ugcId}/edit")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Details, Topic.Ugc)]
    public class EditController : V2WoodstockControllerBase
    {
        /// <summary>
        ///    Edit a UGC item.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Update | ActionAreaLogTags.Ugc)]
        [Authorize(Policy = UserAttributeValues.EditUgc)]
        public async Task<IActionResult> Get(string ugcId, [FromBody] UgcEditInput ugcEditInput)
        {
            if (!Guid.TryParse(ugcId, out var parsedUgcId))
            {
                throw new BadRequestStewardException($"'{ugcId}' was not parseable as a GUID.");
            }

            if (ugcEditInput == null)
            {
                throw new BadRequestStewardException($"{nameof(ugcEditInput)} not provided.");
            }

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
        public async Task<IActionResult> EditStats(string ugcId, [FromBody] UgcEditStatsInput ugcEditStatsInput)
        {
            if (!Guid.TryParse(ugcId, out var parsedUgcId))
            {
                throw new BadRequestStewardException($"'{ugcId}' was not parseable as a GUID.");
            }

            if (ugcEditStatsInput == null)
            {
                throw new BadRequestStewardException($"{nameof(ugcEditStatsInput)} not provided.");
            }

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
