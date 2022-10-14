using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
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
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using static Turn10.Services.LiveOps.FM8.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Handles requests for Steelhead player details.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.MediaTeam,
        UserRole.MotorsportDesigner,
        UserRole.HorizonDesigner)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Target.Details)]
    public class PlayerDetailsController : V2SteelheadControllerBase
    {
        private const int DefaultMaxResults = 500;
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PlayerDetailsController"/> class.
        /// </summary>
        public PlayerDetailsController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        [HttpGet("gamertag/{gamertag}/details")]
        [SwaggerResponse(200, type: typeof(SteelheadPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(
            string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var response = await this.Services.LiveOpsService.GetLiveOpsUserDataByGamerTag(gamertag)
                    .ConfigureAwait(false);

                var result = this.mapper.Map<SteelheadPlayerDetails>(response.userData);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"No player found. (Gamertag: {gamertag})", ex);
            }
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        [HttpGet("xuid/{xuid}/details")]
        [SwaggerResponse(200, type: typeof(SteelheadPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(
            ulong xuid)
        {
            try
            {
                var response = await this.Services.LiveOpsService.GetLiveOpsUserDataByXuid(xuid)
                    .ConfigureAwait(false);

                var result = this.mapper.Map<SteelheadPlayerDetails>(response.userData);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"No player found. (XUID: {xuid})", ex);
            }
        }

        /// <summary>
        ///     Gets the player game details.
        /// </summary>
        [HttpGet("xuid/{xuid}/gamedetails")]
        [SwaggerResponse(200, type: typeof(PlayerGameDetails))]
        public async Task<IActionResult> GetPlayerGameDetails(
            ulong xuid)
        {
            GetUserDetailsOutput response;

            try
            {
                response = await this.Services.UserManagementService.GetUserDetails(xuid)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get player game details. (XUID: {xuid})", ex);
            }

            var result = this.mapper.SafeMap<PlayerGameDetails>(response.forzaUser);

            return this.Ok(result);
        }
    }
}
