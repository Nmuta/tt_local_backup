using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
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
            //xuid.IsValidXuid();

            LiveOpsService.GetDriverLevelOutput response = null;

            try
            {
                response = await this.Services.LiveOpsService.GetDriverLevel(xuid).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"No driver level found for player. (XUID: {xuid})", ex);
            }

            var mappedResponse = this.mapper.SafeMap<SteelheadDriverLevel>(response);

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
        [Authorize(Policy = UserAttribute.SetDriverLevel)]
        public async Task<IActionResult> SetDriverLevel(ulong xuid, uint driverLevel, uint prestigeRank)
        {
            //xuid.IsValidXuid();

            try
            {
                await this.Services.LiveOpsService.SetDriverLevel(xuid, driverLevel, prestigeRank).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to set driver level for player. (XUID: {xuid} -- Driver Level: {driverLevel} -- Prestige Rank: {prestigeRank})", ex);
            }

            return this.Ok();
        }
    }
}
