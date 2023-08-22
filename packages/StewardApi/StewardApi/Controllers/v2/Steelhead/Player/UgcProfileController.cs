using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Steelhead.Player
{
    /// <summary>
    ///     Controller for interacting with Steelhead UGC profiles.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/profile/{externalProfileId}")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.UgcProfile)]
    public class UgcProfileController : V2SteelheadControllerBase
    {
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UgcProfileController"/> class.
        /// </summary>
        public UgcProfileController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the players UGC profile.
        /// </summary>
        [HttpGet("UgcProfile")]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Profile)]
        [SwaggerResponse(200, type: typeof(UgcProfileInfo))]
        public async Task<IActionResult> GetUgcProfile(
            ulong xuid,
            string externalProfileId)
        {
            var externalProfileGuid = externalProfileId.TryParseGuidElseThrow(nameof(externalProfileId));

            var response = await this.Services.LiveOpsService.DownloadUGCProfile(xuid, externalProfileGuid).ConfigureAwait(true);

            var convertedResponse = this.mapper.SafeMap<UgcProfileInfo>(response);

            return this.Ok(convertedResponse);
        }

        /// <summary>
        ///     Updates the players UGC profile.
        /// </summary>
        [HttpPost("UgcProfile")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Profile)]
        [AutoActionLogging(TitleCodeName.Steelhead, StewardAction.Update, StewardSubject.Player)]
        [Authorize(Policy = UserAttributeValues.UpdateUgcProfile)]
        public async Task<IActionResult> UpdateUgcProfile(ulong xuid, string externalProfileId, [FromBody] string profileData)
        {
            var externalProfileGuid = externalProfileId.TryParseGuidElseThrow(nameof(externalProfileId));

            await this.Services.LiveOpsService.UploadUGCProfile(xuid, externalProfileGuid, profileData).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
