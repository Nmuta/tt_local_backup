using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.MediaTeam,
        UserRole.MotorsportDesigner,
        UserRole.HorizonDesigner)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.Consoles)]
    public class ConsolesController : V2SteelheadControllerBase
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 500;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ConsolesController"/> class.
        /// </summary>
        public ConsolesController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the console details.
        /// </summary>
        [HttpGet("consoles")]
        [SwaggerResponse(200, type: typeof(List<ConsoleDetails>))]
        public async Task<IActionResult> GetConsoles(
            ulong xuid,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var response = await this.Services.UserManagementService.GetConsoles(xuid, maxResults).ConfigureAwait(true);
                var result = this.mapper.Map<IList<ConsoleDetails>>(response.consoles);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No consoles found. (XUID: {xuid})", ex);
            }
        }

        /// <summary>
        ///     Gets the console details.
        /// </summary>
        [HttpGet("sharedConsoleUsers")]
        [SwaggerResponse(200, type: typeof(List<SharedConsoleUser>))]
        public async Task<IActionResult> GetSharedConsoleUsers(
            ulong xuid,
            [FromQuery] int startIndex = DefaultStartIndex,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var response = await this.Services.UserManagementService.GetSharedConsoleUsers(
                        xuid,
                        startIndex,
                        maxResults).ConfigureAwait(true);

                var result = this.mapper.Map<IList<SharedConsoleUser>>(response.sharedConsoleUsers);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No shared console users found. (XUID: {xuid})", ex);
            }
        }
    }
}
