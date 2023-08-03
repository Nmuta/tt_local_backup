﻿using System;
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
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Player
{
    /// <summary>
    ///     Controller for user profile notes.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/player/{xuid}/profileNotes")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Player, Topic.ProfileNotes)]
    public class ProfileNotesController : V2WoodstockControllerBase
    {
        private const int DefaultMaxResults = 500;
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;
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
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            UserManagementService.GetAdminCommentsOutput response;

            response = await this.Services.UserManagementService.GetAdminComments(xuid, maxResults).ConfigureAwait(true);

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
        [Authorize(Policy = UserAttributeValues.AddProfileNote)]
        public async Task<IActionResult> AddProfileNoteAsync(
            ulong xuid,
            [FromBody] string profileNote)
        {
            profileNote.ShouldNotBeNullEmptyOrWhiteSpace(nameof(profileNote));
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);
            var userClaims = this.User.UserClaims();

            await this.Services.UserManagementService.AddAdminComment(xuid, profileNote, userClaims.EmailAddress).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
