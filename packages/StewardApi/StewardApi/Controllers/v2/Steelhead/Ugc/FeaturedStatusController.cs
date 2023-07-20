using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Validation;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Ugc
{
    /// <summary>
    ///     Manages featured status Steelhead UGC.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/ugc/{id}/featuredStatus")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Ugc, Target.Details)]
    public class FeaturedStatusController : V2SteelheadControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="FeaturedStatusController"/> class.
        /// </summary>
        public FeaturedStatusController()
        {
        }

        /// <summary>
        ///    Generate sharecode for UGC identified by UGC ID.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(GenerateSharecodeResponse))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta | ActionAreaLogTags.Ugc)]
        [AutoActionLogging(TitleCodeName.Steelhead, StewardAction.Update, StewardSubject.UserGeneratedContent)]
        [Authorize(Policy = UserAttribute.FeatureUgc)]
        public async Task<IActionResult> SetUgcFeaturedStatus(
            string ugcId,
            [FromBody] UgcFeaturedStatus status)
        {
            status.ShouldNotBeNull(nameof(status));

            if (!Guid.TryParse(ugcId, out var itemIdGuid))
            {
                throw new InvalidArgumentsStewardException($"UGC item id provided is not a valid Guid: {ugcId}");
            }

            if (status.IsFeatured)
            {
                status.FeaturedExpiry?.ShouldBeOverMinimumDuration(TimeSpan.FromDays(1), nameof(status.FeaturedExpiry));
            }


            var featureEndDate = status.IsFeatured && status.FeaturedExpiry.HasValue ? DateTime.UtcNow.Add(status.FeaturedExpiry.Value) : DateTime.MinValue;
            var forceFeatureEndDate = status.IsFeatured && status.ForceFeaturedExpiry.HasValue ? DateTime.UtcNow.Add(status.ForceFeaturedExpiry.Value) : DateTime.MinValue; // Verify PR is checked in.

            await this.SteelheadServices.Value.StorefrontManagementService.SetFeatured(
                itemIdGuid,
                status.IsFeatured,
                featureEndDate,
                forceFeatureEndDate).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
