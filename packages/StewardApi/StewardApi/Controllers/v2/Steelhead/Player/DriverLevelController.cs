using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Controller for working with driver level.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/driverLevel")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.DriverLevel)]
    public class DriverLevelController : V2SteelheadControllerBase
    {
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="DriverLevelController"/> class.
        /// </summary>
        public DriverLevelController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets player driver level.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(SteelheadDriverLevel))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetDriverLevel(ulong xuid)
        {
            ////xuid.IsValidXuid();

            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            var mappedResponse = await this.RetrieveDriverLevel(xuid).ConfigureAwait(true);

            return this.Ok(mappedResponse);
        }

        /// <summary>
        ///    Sets player driver level.
        /// </summary>
        [HttpPost]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Steelhead, StewardAction.Update, StewardSubject.Player)]
        [Authorize(Policy = UserAttributeValues.SetDriverLevel)]
        public async Task<IActionResult> SetDriverLevel(ulong xuid, [FromBody] SteelheadDriverLevel newDriverLevel)
        {
            ////xuid.IsValidXuid();

            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            newDriverLevel.DriverLevel.ShouldBeGreaterThanOrEqual(1, nameof(newDriverLevel.DriverLevel));
            newDriverLevel.DriverLevel.ShouldBeLessThanOrEqual(999, nameof(newDriverLevel.DriverLevel));
            newDriverLevel.PrestigeRank.ShouldBeGreaterThanOrEqual(0, nameof(newDriverLevel.PrestigeRank));
            newDriverLevel.PrestigeRank.ShouldBeLessThanOrEqual(9, nameof(newDriverLevel.PrestigeRank));

            await this.Services.LiveOpsService.SetDriverLevel(xuid, newDriverLevel.DriverLevel, newDriverLevel.PrestigeRank).ConfigureAwait(false);

            var mappedResponse = await this.RetrieveDriverLevel(xuid).ConfigureAwait(true);

            return this.Ok(mappedResponse);
        }

        /// <summary>
        ///     Retrieves the driver level for a xuid
        /// </summary>
        private async Task<SteelheadDriverLevel> RetrieveDriverLevel(ulong xuid)
        {
            LiveOpsService.GetDriverLevelOutput response = null;

            response = await this.Services.LiveOpsService.GetDriverLevel(xuid).ConfigureAwait(true);

            var mappedResponse = this.mapper.SafeMap<SteelheadDriverLevel>(response);

            return mappedResponse;
        }
    }
}
