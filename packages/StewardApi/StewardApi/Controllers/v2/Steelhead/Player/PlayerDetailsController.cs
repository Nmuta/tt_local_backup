﻿using System;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Castle.Core.Internal;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
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
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Target.Details)]
    public class PlayerDetailsController : V2SteelheadControllerBase
    {
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

            var response = await this.Services.LiveOpsService.GetLiveOpsUserDataByGamerTag(gamertag)
                .ConfigureAwait(false);

            var result = this.mapper.SafeMap<SteelheadPlayerDetails>(response.userData);

            if (result.Region < 0)
            {
                throw new NotFoundStewardException($"Game details not found. (GTag: {gamertag})");
            }

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        [HttpGet("xuid/{xuid}/details")]
        [SwaggerResponse(200, type: typeof(SteelheadPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(
            ulong xuid)
        {
            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);

            var response = await this.Services.LiveOpsService.GetLiveOpsUserDataByXuid(xuid)
                .ConfigureAwait(false);

            var result = this.mapper.SafeMap<SteelheadPlayerDetails>(response.userData);

            if (result.Region < 0)
            {
                throw new NotFoundStewardException($"Game details not found. (XUID: {xuid})");
            }

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets the player game details.
        /// </summary>
        [HttpGet("xuid/{xuid}/gamedetails")]
        [SwaggerResponse(200, type: typeof(PlayerGameDetails))]
        public async Task<IActionResult> GetPlayerGameDetails(
            ulong xuid)
        {
            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);

            var response = await this.Services.UserManagementService.GetUserDetails(xuid)
                .ConfigureAwait(false);

            var result = this.mapper.SafeMap<PlayerGameDetails>(response.forzaUser);

            if (result.Gamertag.IsNullOrEmpty())
            {
                throw new NotFoundStewardException($"Game details not found. (XUID: {xuid})");
            }

            return this.Ok(result);
        }
    }
}
