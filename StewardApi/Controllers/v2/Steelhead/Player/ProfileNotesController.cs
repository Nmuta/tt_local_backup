using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
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
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/profileNotes")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.ProfileNotes)]
    public class ProfileNotesController : V2SteelheadControllerBase
    {
        private const int DefaultMaxResults = 500;
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ProfileNotesController"/> class.
        /// </summary>
        public ProfileNotesController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the user's profile notes.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<ProfileNote>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetProfileNotesAsync(
            ulong xuid,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            await this.EnsurePlayerExist(this.Services, xuid).ConfigureAwait(true);

            Services.LiveOps.FM8.Generated.UserManagementService.GetAdminCommentsOutput response = null;

            try
            {
                response = await this.Services.UserManagementService.GetAdminComments(xuid, maxResults).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"No profile notes found. (XUID: {xuid})", ex);
            }

            var result = this.mapper.SafeMap<IList<ProfileNote>>(response.adminComments);

            return this.Ok(result);
        }

        /// <summary>
        ///     Adds a profile note to a user's profile.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(CodeName, StewardAction.Add, StewardSubject.ProfileNotes)]
        [Authorize(Policy = UserAttribute.AddProfileNote)]
        public async Task<IActionResult> AddProfileNoteAsync(
            ulong xuid,
            [FromBody] ProfileNote profileNote)
        {
            profileNote.ShouldNotBeNull(nameof(profileNote));
            await this.EnsurePlayerExist(this.Services, xuid).ConfigureAwait(true);

            var userClaims = this.User.UserClaims();
            profileNote.Author = userClaims.EmailAddress;

            try
            {
                await this.Services.UserManagementService.AddAdminComment(xuid, profileNote.Text, profileNote.Author).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Could not add profile note. (XUID: {xuid})", ex);
            }

            return this.Ok();
        }
    }
}
